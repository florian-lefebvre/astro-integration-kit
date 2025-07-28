import type { AstroConfig } from "astro";
import type { Plugin, PluginOption } from "vite";
import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

function getPlugins(
	store: Set<Plugin<any>>,
	plugins: AstroConfig["vite"]["plugins"],
) {
	if (plugins) {
		for (const plugin of plugins) {
			if (!plugin) continue;

			if (Array.isArray(plugin)) {
				getPlugins(store, plugin);
				continue;
			}

			if (plugin instanceof Promise) {
				continue;
			}
			// Cast this as any to avoid type errors with Vite plugins
			// these errors happen now because we have astro 5 in the playground
			store.add(plugin as any);
		}
	}
	return store;
}

export const hasVitePluginPlugin = definePlugin({
	name: "hasVitePlugin",
	setup() {
		return {
			"astro:config:setup": (params) => {
				const currentPlugins = getPlugins(
					new Set(),
					params.config.vite?.plugins,
				);

				const { updateConfig, config } = params;

				params.updateConfig = (newConfig) => {
					// Cast this as any to avoid type errors with Vite plugins
					// these errors happen now because we have astro v5 in the playground
					config.vite.plugins = Array.from(
						getPlugins(currentPlugins, newConfig.vite?.plugins),
					) as any;
					return updateConfig(newConfig);
				};

				return {
					hasVitePlugin: (plugin: string | PluginOption) =>
						hasVitePlugin(params, {
							plugin,
						}),
				};
			},
		};
	},
});
