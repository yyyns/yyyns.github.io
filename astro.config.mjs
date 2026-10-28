// @ts-check

import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { satteriKatex } from './plugins/satteri-katex.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://hylu.top',
	integrations: [mdx(), sitemap()],
	markdown: {
		// satteri 是 Astro 7 的默认 Markdown 引擎。
		// features.math 只开启数学「解析」，渲染由 satteriKatex 插件负责。
		processor: satteri({
			features: { math: true },
			hastPlugins: [satteriKatex],
		}),
	},
	fonts: [
		{
			// Latin-only build. CJK characters are not in this file, so the
			// browser falls back to the next font in the stack (monospace),
			// which resolves to a system CJK font.
			provider: fontProviders.local(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains',
			fallbacks: ['monospace'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/jetbrains-mono-regular.woff2'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/jetbrains-mono-bold.woff2'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/jetbrains-mono-italic.woff2'],
						weight: 400,
						style: 'italic',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/jetbrains-mono-bold-italic.woff2'],
						weight: 700,
						style: 'italic',
						display: 'swap',
					},
				],
			},
		},
	],
});
