import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	site: "https://astro-kit.netlify.app",
	integrations: [
		starlight({
			title: "Astro Kit",
			logo: {
				src: "./src/assets/houston.webp",
			},
			social: {
				github: "https://github.com/florian-lefebvre/astro-kit",
			},
			editLink: {
				baseUrl:
					"https://github.com/florian-lefebvre/astro-kit/edit/main/docs/",
			},
			sidebar: [
				{
					label: "Getting started",
					items: [
						{
							label: "Installation",
							link: "/getting-started/installation/",
						},
					],
				},
				{
					label: "Utilities",
					autogenerate: { directory: "utilities" },
				},
			],
			lastUpdated: true
		}),
	],
});
