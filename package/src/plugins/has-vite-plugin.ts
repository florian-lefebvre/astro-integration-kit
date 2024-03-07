import type { AstroConfig } from "astro";
import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

type PluginOption = Extract<
	NonNullable<NonNullable<AstroConfig["vite"]["plugins"]>[number]>,
	{ name: string }
>;

function getPlugins(
	store: Set<PluginOption>,
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
			astroConfig.config.vite.plugins = [
				...getPlugins(currentPlugins, config.vite?.plugins),
			];
			return updateConfig(config);
		};

		return (plugin: string | PluginOption) =>
			hasVitePlugin({
				plugin,
				config: astroConfig.config,
			});
	},
});
