import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { version } from "../packages/astro-integration-kit/package.json";

// https://astro.build/config
export default defineConfig({
	site: "https://astro-integration-kit.netlify.app",
	integrations: [
		starlight({
			title: "Astro Integration Kit",
			logo: {
				src: "./src/assets/houston.webp",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/florian-lefebvre/astro-integration-kit",
				},
				{
					icon: "discord",
					label: "Discord",
					href: "https://discord.com/channels/830184174198718474/1197638002764152843",
				},
			],
			editLink: {
				baseUrl:
					"https://github.com/florian-lefebvre/astro-integration-kit/edit/main/docs/",
			},
			customCss: ["./src/styles/main.css"],
			sidebar: [
				"migration-guide",
				{
					label: "Getting started",
					collapsed: true,
					items: [
						{
							label: "Installation & Usage",
							link: "/getting-started/usage/",
						},
						{
							label: "Why Astro Integration Kit",
							link: "/getting-started/why",
						},
						{
							label: "Showcase",
							link: "/getting-started/showcase/",
						},
						{
							label: "Upgrade guide",
							link: "/getting-started/upgrade-guide/",
						},
					],
				},
				{
					label: "Dev",
					collapsed: true,
					items: [
						{
							label: "hmrIntegration",
							link: "/dev/hmr-integration/",
						},
						{
							label: "importFresh",
							link: "/dev/import-fresh/",
						},
					],
				},
				{
					label: "Core",
					collapsed: true,
					items: [
						{
							label: "defineIntegration",
							link: "/core/define-integration/",
						},
						{
							label: "createResolver",
							link: "/core/create-resolver/",
						},
						{
							label: "defineUtility",
							link: "/core/define-utility/",
						},
						{
							label: "withPlugins (advanced)",
							link: "/core/with-plugins/",
						},
						{
							label: "definePlugin (advanced)",
							link: "/core/define-plugin/",
						},
					],
				},
				{
					label: "Utilities",
					collapsed: true,
					items: [
						{
							label: "addIntegration",
							link: "/utilities/add-integration/",
						},
						{
							label: "addVirtualImports",
							link: "/utilities/add-virtual-imports/",
						},
						{
							label: "addVitePlugin",
							link: "/utilities/add-vite-plugin/",
						},
						{
							label: "hasVitePlugin",
							link: "/utilities/has-vite-plugin/",
						},
						{
							label: "hasIntegration",
							link: "/utilities/has-integration/",
						},
						{
							label: "injectDevRoute",
							link: "/utilities/inject-dev-route/",
						},
						{
							label: "watchDirectory",
							link: "/utilities/watch-directory/",
						},
					],
				},
				{
					label: "Plugins",
					collapsed: true,
					items: [
						{ label: "hasVitePlugin", link: "/plugins/has-vite-plugin/" },
					],
				},
				{
					label: `v${version} changelog ↗`,
					link: `https://github.com/florian-lefebvre/astro-integration-kit/blob/main/package/CHANGELOG.md#${version.replaceAll(
						".",
						"",
					)}`,
					attrs: {
						target: "_blank",
					},
				},
			],
			lastUpdated: true,
		}),
	],
	redirects: {
		"/getting-started/breaking-changes/": "/getting-started/upgrade-guide/",
		"/getting-started/installation/": "/getting-started/usage/",
	},
});
