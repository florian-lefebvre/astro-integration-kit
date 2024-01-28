import type { AstroIntegration } from "astro";
import { defu } from "defu";
import type { ExtendedHooks } from "../types.js";
import { addVirtualImport } from "../utils/add-virtual-import.js";
import { addVitePlugin } from "../utils/add-vite-plugin.js";
import { hasIntegration } from "./has-integration.js";
import { watchIntegration } from "./watch-integration.js";

/**
 * Makes creating integrations easier, and adds a few goodies!
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {object} params.object - Any default config options you want to set
 * @param {function} params.setup - This will be called from your `astro:config:setup` call with the user options
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-integration/
 *
 * @example
 * ```ts
 * export default defineIntergration({
 *		name: "my-integration",
 *		defaults: {
 *    		foo: "bar",
 * 		},
 * 		setup({ options }) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
export const defineIntegration = <
	TOptions extends Record<string, unknown> = never,
>({
	name,
	defaults,
	setup,
}: {
	name: string;
	defaults: {
		[Property in keyof TOptions]-?: TOptions[Property];
	};
	setup: (params: {
		name: string;
		options: TOptions;
	}) => ExtendedHooks;
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
		const options = defu(_options, defaults ?? {}) as TOptions;

		const providedHooks = setup({ name, options });

		const hooks: AstroIntegration["hooks"] = {
			"astro:config:setup": (params) => {
				return providedHooks["astro:config:setup"]?.({
					...params,
					addVirtualImport: ({ name, content }) =>
						addVirtualImport({
							name,
							content,
							updateConfig: params.updateConfig,
						}),
					addVitePlugin: (plugin) =>
						addVitePlugin({ plugin, updateConfig: params.updateConfig }),
					hasIntegration: (other, { position } = {}) =>
						hasIntegration({
							name: other,
							config: params.config,
							...(!!position && {
								[position]: name,
							})
						}),
					watchIntegration: (dir) =>
						watchIntegration({
							command: params.command,
							dir,
							addWatchFile: params.addWatchFile,
							updateConfig: params.updateConfig,
						}),
				});
			},
			"astro:config:done": (params) => {
				return providedHooks["astro:config:done"]?.({ ...params });
			},
			"astro:server:setup": (params) => {
				return providedHooks["astro:server:setup"]?.({ ...params });
			},
			"astro:server:start": (params) => {
				return providedHooks["astro:server:start"]?.({ ...params });
			},
			"astro:server:done": (params) => {
				return providedHooks["astro:server:done"]?.({ ...params });
			},
			"astro:build:start": (params) => {
				return providedHooks["astro:build:start"]?.({ ...params });
			},
			"astro:build:setup": (params) => {
				return providedHooks["astro:build:setup"]?.({ ...params });
			},
			"astro:build:generated": (params) => {
				return providedHooks["astro:build:generated"]?.({ ...params });
			},
			"astro:build:ssr": (params) => {
				return providedHooks["astro:build:ssr"]?.({ ...params });
			},
			"astro:build:done": (params) => {
				return providedHooks["astro:build:done"]?.({ ...params });
			},
		};

		return {
			name,
			hooks,
		};
	};
};
