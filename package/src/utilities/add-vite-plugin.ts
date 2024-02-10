import type { HookParameters } from "astro";
import type { PluginOption } from "vite";

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 *
 * @param {Params} params
 * @param {import("vite").Plugin} params.plugin
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 * addVitePlugin({
 * 		plugin,
 * 		updateConfig
 * })
 * ```
 */
export const addVitePlugin = ({
	plugin,
	updateConfig,
}: {
	plugin: PluginOption;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}) => {
	updateConfig({
		vite: {
			plugins: [plugin],
		},
	});
};
