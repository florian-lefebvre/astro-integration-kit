import { readFileSync } from "node:fs";
import { createResolver } from "../core/create-resolver.js";
import { addVirtualImports } from "./add-virtual-imports.js";
import { defineUtility } from "../core/define-utility.js";

/**
 * Add a Dev Toolbar Plugin that uses a Framework component.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {string} options.name - The name of the toolbar plugin
 * @param {string} options.icon - This should be an inline SVG
 * @param {string} options.framework - The framework your component is using. Can be either "react", "vue", "svelte", "solid", or "preact"
 * @param {URL} options.src - Path to your component
 * @param {string} options.style - A stylesheet to pass to your plugin
 *
 * @example
 * ```ts
 * addDevToolbarFrameworkApp(params, {
 *      framework: "vue",
 *      name: "Test Vue Plugin",
 *      id: "test-vue-plugin",
 *      icon: `<svg version="1.1" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)"><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883"/></g><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e"/></g></g></svg>`,
 *      src: resolve("./Test.vue"),
 *      style: `
 *          button {
 *              background-color: rebeccapurple;
 *          }
 *      `,
 * });
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-devtoolbar-framework-app/
 */
export const addDevToolbarFrameworkApp = defineUtility("astro:config:setup")(
	(
		params,
		{
			id,
			framework,
			icon,
			name,
			src,
			style,
		}: {
			id: string;
			name: string;
			icon: string;
			framework: "react" | "preact" | "vue" | "svelte" | "solid";
			src: string;
			style?: string;
		},
	) => {
		const { injectScript, addDevToolbarApp } = params;
		const virtualModuleName = `virtual:astro-devtoolbar-app-${id}`;

		const { resolve } = createResolver(import.meta.url);

		let content = readFileSync(
			resolve(`../stubs/add-devtoolbar-framework-app/${framework}.js`),
			"utf-8",
		);

		const escapedIcon = icon.replace("`", '${"`"}');

		content = content
			.replace("@@COMPONENT_SRC@@", src)
			.replace("@@ID@@", id)
			.replace("@@NAME@@", name)
			.replace("@@ICON@@", escapedIcon)
			.replace("@@STYLE@@", style ?? "");

		addVirtualImports(params, {
			name: id,
			imports: { [virtualModuleName]: content },
		});

		if (framework === "react") {
			import("@vitejs/plugin-react").then((react) => {
				const FAST_REFRESH_PREAMBLE = react.default.preambleCode;
				const preamble = FAST_REFRESH_PREAMBLE.replace("__BASE__", "/");
				injectScript("page", preamble);
			});
		}

		addDevToolbarApp(virtualModuleName);
	},
);
