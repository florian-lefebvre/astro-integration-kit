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
 * ```ts
 *  addVitePlugin({
 *      plugin: yourPlugin,
 *      updateConfig
 *  })
 * ```
 */
export const vanillaAddVitePlugin = (params: Params) => {
	_addVitePlugin(params);
};
