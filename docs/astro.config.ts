import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://astro-integration-kit.netlify.app",
	integrations: [
		starlight({
			title: "Astro Integration Kit",
			logo: {
				src: "./src/assets/houston.webp",
			},
			social: {
				github: "https://github.com/florian-lefebvre/astro-integration-kit",
			},
			editLink: {
				baseUrl:
					"https://github.com/florian-lefebvre/astro-integration-kit/edit/main/docs/",
			},
			sidebar: [
				{
					label: "Getting started",
					items: [
						{
							label: "Installation",
							link: "/getting-started/installation/",
						},
						{
							label: "Usage",
							link: "/getting-started/usage/",
						},
						{
							label: "Showcase",
							link: "/getting-started/showcase/",
						},
					],
				},
				{
					label: "Utilities",
					autogenerate: { directory: "utilities" },
				},
			],
			lastUpdated: true,
		}),
	],
});
