import type { HookParameters } from "astro";
import type { PluginOption } from "vite";
import { useHookParams } from "../internal/use-hook-params.js";

type Params = {
	plugin: PluginOption;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
};

const _addVitePlugin = ({ plugin, updateConfig }: Params) => {
	updateConfig({
		vite: {
			plugins: [plugin],
		},
	});
};

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 * 
 * @param {PluginOption} plugin
 * 
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 *  addVitePlugin(yourPlugin)
 * ```
 */
export const addVitePlugin = (plugin: Params["plugin"]) => {
	const { updateConfig } = useHookParams("astro:config:setup");

	_addVitePlugin({ plugin, updateConfig });
};

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 * 
 * @param {Params} params
 * @param {Plugin} params.plugin
 * @param {updateConfig} params.updateConfig
 * 
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 *  addVitePlugin(yourPlugin)
 * ```
 */
export const vanillaAddVitePlugin = (params: Params) => {
	_addVitePlugin(params);
};
