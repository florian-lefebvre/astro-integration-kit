import type { HookParameters } from "astro";
import type { Plugin } from "vite";
import { useHookParams } from "../internal/use-hook-params.js";

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

type Params = {
	name: string;
	content: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
};

const _addVirtualImport = ({ name, content, updateConfig }: Params) => {
	updateConfig({
		vite: {
			plugins: [createVirtualModule(name, content)],
		},
	});
};

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImport } from "astro-integration-kit";
 *
 * addVirtualImport(
 *   name: 'virtual:my-integration/config',
 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
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
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
 */
export const addVirtualImport = ({
	name,
	content,
}: Omit<Params, "updateConfig">) => {
	const { updateConfig } = useHookParams("astro:config:setup");

	_addVirtualImport({ name, content, updateConfig });
};

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * ```ts
 * // my-integration/index.ts
 * import { addVirtualImport } from "astro-integration-kit/vanilla";
 *
 * addVirtualImport(
 *   name: 'virtual:my-integration/config',
 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
 * 	 updateConfig
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
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-virtual-import/
 */
export const vanillaAddVirtualImport = (params: Params) => {
	_addVirtualImport(params);
};
