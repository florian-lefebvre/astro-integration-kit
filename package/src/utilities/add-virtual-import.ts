import type { HookParameters } from "astro";
import { AstroError } from "astro/errors";
import type { Plugin } from "vite";
import { addVitePlugin } from "./add-vite-plugin.js";

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => {
	return `\0${id}`;
};

const createVirtualModule = (name: string, content: string): Plugin => {
	const pluginName = `vite-plugin-${name}`;

	return {
		name: pluginName,
		resolveId(id) {
			if (id === name) {
				return resolveVirtualModuleId(id);
			}
		},
		load(id) {
			if (id === resolveVirtualModuleId(name)) {
				return content;
			}
		},
	};
};

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.content
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
 *
 * @example
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImport } from "astro-integration-kit";
 *
 * addVirtualImport(
 * 		name: 'virtual:my-integration/config',
 *   	content: `export default ${ JSON.stringify({foo: "bar"}) }`,
 * 		updateConfig
 * );
 * ```
 *
 * This is then readable anywhere else in your integration:
 *
 * ```ts
 * // myIntegration/src/component/layout.astro
 * import config from "virtual:my-integration/config";
 *
 * console.log(config.foo) // "bar"
 * ```
 */
export const addVirtualImport = ({
	name,
	content,
	updateConfig,
}: {
	name: string;
	content: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
	if (name.startsWith("astro:")) {
		throw new AstroError(
			`Virtual import name prefix can't be "astro:" (for "${name}") because it's reserved for Astro core.`,
		);
	}

	addVitePlugin({
		plugin: createVirtualModule(name, content),
		updateConfig,
	});
};
