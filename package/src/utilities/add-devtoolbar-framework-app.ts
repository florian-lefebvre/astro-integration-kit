import { readFileSync } from "fs";
import { type HookParameters } from "astro";
import { AstroError } from "astro/errors";
import { createResolver } from "../core/create-resolver.js";
import { addVirtualImport } from "./add-virtual-import.js";

type SupportedFrameworks = "react" | "preact" | "vue" | "svelte" | "solid";

async function checkMissingDependencies(deps: string[]): Promise<string[]> {
	const missingDeps: string[] = [];

	await Promise.all(
		deps.map((dep) => import(/* @vite-ignore */dep).catch(() => missingDeps.push(dep))),
	);

	return missingDeps;
}

const missingImports: Record<SupportedFrameworks, Array<string>> = {
	preact: await checkMissingDependencies(["preact"]),
	react: await checkMissingDependencies(["react", "@vitejs/plugin-react"]),
	svelte: await checkMissingDependencies(["svelte"]),
	solid: await checkMissingDependencies(["solid-js"]),
	vue: await checkMissingDependencies(["vue"]),
};

export type addDevToolbarFrameworkAppUserParams = {
	id: string;
	name: string;
	icon: string;
	framework: SupportedFrameworks;
	src: string;
	style?: string;
};

export type addDevToolbarFrameworkAppParams = addDevToolbarFrameworkAppUserParams & {
	addDevToolbarApp: HookParameters<"astro:config:setup">["addDevToolbarApp"];
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
	injectScript: HookParameters<"astro:config:setup">["injectScript"];
};

/**
 * Add a Dev Toolbar Plugin that uses a Framework component.
 *
 * @param {object} params
 * @param {string} params.name - The name of the toolbar plugin
 * @param {string} params.icon - This should be an inline SVG
 * @param {URL} params.framework
 * @param {URL} params.src - Path to your component
 * @param {URL} params.style - A stylesheet to pass to your plugin
 * @param {URL} params.callback - A callback function containing the canvas and window your plugin is loaded on
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 * @param {import("astro").HookParameters<"astro:config:setup">["addDevToolbarApp"]} params.addDevToolbarApp
 * @param {import("astro").HookParameters<"astro:config:setup">["injectScript"]} params.injectScript
 *
 * @example
 * ```ts
 * addDevToolbarFrameworkApp({
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
 * @see https://astro-integration-kit.netlify.app/utilities/add-devtoolbar-plugin/
 */
export const addDevToolbarFrameworkApp = ({
	id,
	name,
	icon,
	framework,
	src,
	style,
	addDevToolbarApp,
	updateConfig,
	injectScript,
}: addDevToolbarFrameworkAppParams) => {
	const virtualModuleName = `virtual:astro-devtoolbar-app-${id}`;

	const missingImportsForFramework = missingImports[framework];
	if (missingImportsForFramework.length > 0) {
		throw new AstroError(
			`Missing dependencies for ${framework} framework: ${missingImportsForFramework.join(
				", ",
			)}`,
		);
	}

	const { resolve } = createResolver(import.meta.url);

	let content = readFileSync(
		resolve(`./addDevToolbarFrameworkAppStubs/${framework}.ts`),
		"utf8",
	);

	content = content
		.replace("@@COMPONENT_SRC@@", src)
		.replace("@@ID@@", id)
		.replace("@@NAME@@", name)
		.replace("@@ICON@@", icon)
		.replace("@@STYLE@@", style ?? "");

	addVirtualImport({
		name: virtualModuleName,
		content,
		updateConfig,
	});

	switch (framework) {
		case "react":
			import("@vitejs/plugin-react").then((react) => {
				const FAST_REFRESH_PREAMBLE = react.default.preambleCode;
				const preamble = FAST_REFRESH_PREAMBLE.replace("__BASE__", "/");
				injectScript("page", preamble);
			});

			break;
	}

	addDevToolbarApp(virtualModuleName);
};
