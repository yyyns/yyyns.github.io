/**
 * Sätteri 的 KaTeX 渲染插件（Astro 7 默认 Markdown 引擎）。
 *
 * 为什么需要这个插件：
 *   satteri 的 `features.math` 只负责「解析」数学语法，不做任何渲染。
 *   它输出的是占位节点：
 *     - 行内 `$...$`          → <code class="language-math math-inline">
 *     - 块级 `$$`↵…↵`$$` 多行  → <pre><code class="language-math math-display">
 *   本插件在 hast 阶段把这些占位节点替换成 KaTeX 生成的 HTML。
 *
 * 注意块级公式的判定：satteri 只有在 `$$` 独占一行、内容与结尾 `$$` 各自成行时
 * 才输出 math-display；写成一行（`$$ x $$`）会退化成 math-inline。
 */
import katex from 'katex';

const MATH_CLASS = 'language-math';

/** 从 <code> 的 className 里读出数学类型，非数学则返回 null。 */
function mathKind(code) {
	const classes = code.properties?.className;
	if (!Array.isArray(classes) || !classes.includes(MATH_CLASS)) return null;
	return classes.includes('math-display') ? 'display' : 'inline';
}

/** 把数学节点渲染成 KaTeX 的 HTML（以 raw 节点注入，原样输出）。 */
function renderMath(codeNode, ctx, kind) {
	const tex = ctx.textContent(codeNode);
	if (!tex.trim()) return;

	let html;
	try {
		html = katex.renderToString(tex, {
			displayMode: kind === 'display',
			// 公式写错时渲染成红色而不是让整个构建崩掉
			throwOnError: false,
			errorColor: '#cc0000',
		});
	} catch (err) {
		ctx.report({
			message: `KaTeX 渲染失败: ${err.message}`,
			node: codeNode,
			severity: 'warning',
		});
		return;
	}

	return { type: 'raw', value: html };
}

export const satteriKatex = {
	name: 'satteri-katex',
	element: [
		{
			// 块级公式：替换整个 <pre>。
			// 只替换内层 <code> 会留下一个空 <pre>，
			// 而 <pre> 的 white-space:pre 会把块级公式的排版搞坏。
			filter: ['pre'],
			visit(node, ctx) {
				const code = node.children?.find(
					(child) => child.type === 'element' && child.tagName === 'code',
				);
				if (!code || mathKind(code) !== 'display') return;
				return renderMath(code, ctx, 'display');
			},
		},
		{
			// 行内公式：satteri 直接输出 <code class="… math-inline">，
			// 外面没有 <pre>，替换自身即可。
			filter: ['code'],
			visit(node, ctx) {
				if (mathKind(node) !== 'inline') return;
				return renderMath(node, ctx, 'inline');
			},
		},
	],
};

export default satteriKatex;
