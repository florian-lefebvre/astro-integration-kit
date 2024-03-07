import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { version } from "../package/package.json";

const badge = (type: "new" | "updated" | "soon" | "removed") => ({
	variant: {
		new: "success" as const,
		updated: "caution" as const,
		soon: "tip" as const,
		removed: "danger" as const,
	}[type],
	text: {
		new: "New",
		updated: "Updated",
		soon: "Soon",
		removed: "Removed",
	}[type],
});

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
				discord:
					"https://discord.com/channels/830184174198718474/1197638002764152843",
			},
			editLink: {
				baseUrl:
					"https://github.com/florian-lefebvre/astro-integration-kit/edit/main/docs/",
			},
			customCss: ["./src/styles/main.css"],
			head: [
				{
					tag: "link",
					attrs: {
						rel: "preconnect",
						href: "https://rsms.me/",
					},
				},
				{
					tag: "link",
					attrs: {
						rel: "stylesheet",
						href: "https://rsms.me/inter/inter.css",
					},
				},
			],
			expressiveCode: {
				themes: ["one-dark-pro", "starlight-light"],
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
							label: "Why Astro Integration Kit",
							link: "/getting-started/why",
						},
						{
							label: "Showcase",
							link: "/getting-started/showcase/",
						},
						{
							label: "Breaking changes",
							link: "/getting-started/breaking-changes/",
						},
					],
				},
				{
					label: "Core",
					items: [
						{
							label: "defineIntegration",
							link: "/core/define-integration/",
						},
						{
							label: "defineOptions",
							link: "/getting-started/breaking-changes/#defineoptions",
							badge: badge("removed"),
							attrs: {
								style: "opacity:0.5;",
							},
						},
						{
							label: "createResolver",
							link: "/core/create-resolver/",
						},
						{
							label: "definePlugin",
							link: "/core/define-plugin/",
						},
					],
				},
				{
					label: "Utilities",
					items: [
						{
							label: "addDevToolbarFrameworkApp",
							link: "/utilities/add-devtoolbar-framework-app/",
							badge: badge("new"),
						},
						{
							label: "addDts",
							link: "/utilities/add-dts/",
						},
						{
							label: "addIntegration",
							link: "/utilities/add-integration/",
							badge: badge("new"),
						},
						{
							label: "addVirtualImport",
							link: "/getting-started/breaking-changes/#addvirtualimport",
							badge: badge("removed"),
							attrs: {
								style: "opacity:0.5;",
							},
						},
						{
							label: "addVirtualImports",
							link: "/utilities/add-virtual-imports/",
							badge: badge("new"),
						},
						{
							label: "addVitePlugin",
							link: "/utilities/add-vite-plugin/",
						},
						{
							label: "hasVitePlugin",
							link: "/utilities/has-vite-plugin/",
							badge: badge("new"),
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
							label: "watchIntegration (HMR)",
							link: "/utilities/watch-integration/",
						},
					],
				},
				{
					label: "Guides",
					items: [
						{
							label: "Authoring an integration",
							link: "/guides/authoring-an-integration",
							badge: badge("soon"),
						},
						{
							label: "Authoring a plugin",
							link: "/guides/authoring-a-plugin",
							badge: badge("soon"),
						},
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
});
