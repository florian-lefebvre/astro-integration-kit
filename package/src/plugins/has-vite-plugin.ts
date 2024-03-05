import type { AstroConfig } from "astro";
import type { PluginOption } from "vite";
import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

function getPlugins(
	store: Set<Extract<NonNullable<NonNullable<AstroConfig["vite"]["plugins"]>[number]>, { name: string }>>,
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

			store.add(plugin);
		}
	}
	return store;
}

export const hasVitePluginPlugin = definePlugin({
	name: "hasVitePlugin",
	hook: "astro:config:setup",
	implementation: (astroConfig) => {
		const currentPlugins = getPlugins(
			new Set(),
			astroConfig.config.vite?.plugins,
		);

		const { updateConfig } = astroConfig;

		astroConfig.updateConfig = (config) => {
			astroConfig.config.vite.plugins = [...getPlugins(currentPlugins, config.vite?.plugins)];
			return updateConfig(config);
		};

		return (plugin: string | PluginOption) =>
			hasVitePlugin({
				plugin,
				config: astroConfig.config,
			});
	},
});
