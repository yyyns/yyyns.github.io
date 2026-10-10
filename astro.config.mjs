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
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
