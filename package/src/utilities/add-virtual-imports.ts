import type { HookParameters } from "astro";
import { AstroError } from "astro/errors";
import type { Plugin } from "vite";
import { addVitePlugin } from "./add-vite-plugin.js";

const resolveVirtualModuleId = <T extends string>(id: T): `\0${T}` => {
	return `\0${id}`;
};

const createVirtualModule = (imports: Record<string, string>): Plugin => {
	const importNames = Object.keys(imports) as (keyof typeof imports)[]

	const resolutionMap = Object.fromEntries(
		importNames.map((importName) => {
			if (importName.startsWith("astro:")) {
				throw new AstroError(
					`Virtual import name prefix can't be "astro:" (for "${importName}") because it's reserved for Astro core.`,
				);
			}
			return [
				resolveVirtualModuleId(importName),
				importName,
			]	
		})
	);

	return {
		name: `vite-plugin-${importNames[0]}`,
		resolveId(id) {
			if (id in imports) return resolveVirtualModuleId(id);
			return;
		},
		load(id) {
			const resolution = resolutionMap[id]
			if (resolution) return imports[resolution];
			return
		},
	};
};

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * @param {object} params
 * @param {Object.<string, string>} params.imports
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-imports/
 *
 * @example
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImports } from "astro-integration-kit";
 *
 * addVirtualImports(
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
export const addVirtualImports = ({
	imports,
	updateConfig,
}: {
	imports: Record<string, string>;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
	addVitePlugin({
		plugin: createVirtualModule(imports),
		updateConfig,
	});
};
