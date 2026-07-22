// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://luisjg.dev',
	base: '/roster-docs',
	integrations: [
		starlight({
			title: 'Class Roster Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/luisjg/roster-docs' }],
			sidebar: [
				{
					label: 'API Reference',
					items: [
						{ label: 'Dashboard API', link: '/api/dashboard-api'},
					],
				},
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				// {
				// 	label: 'Reference',
				// 	items: [{ autogenerate: { directory: 'reference' } }],
				// },
			],
		}),
	],
});
