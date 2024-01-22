import type { HookParameters } from "astro";
import type { Plugin } from "vite";

function resolveVirtualModuleId<T extends string>(id: T): `\0${T}` {
	return `\0${id}`;
}

function createVirtualModule(name: string, content: string): Plugin {
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
}

/**
 * Creates a Vite virtual module and updates the Astro config.
 * Virtual imports are useful for passing things like config options, or data computed within the integration.
 *
 * ```ts
 * // my-integration/index.ts
 * addVirtualImport(
 *   name: 'virtual:my-integration/config',
 *   content: `export default ${ JSON.stringify({foo: "bar"}) }`,
 *   updateConfig,
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
	updateConfig,
}: {
	name: string;
	content: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
	updateConfig({
		vite: {
			plugins: [createVirtualModule(name, content)],
		},
	});
};
