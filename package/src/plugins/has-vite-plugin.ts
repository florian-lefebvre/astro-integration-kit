import type { AstroConfig } from "astro";
import { definePlugin } from "../core/define-plugin.js";

function getPlugins(
	store: Set<string>,
	plugins: AstroConfig["vite"]["plugins"] | undefined,
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

			store.add(plugin.name);
		}
	}
	return store;
}

export const hasVitePluginPlugin = definePlugin({
	name: "hasVitePlugin",
	hook: "astro:config:setup",
	implementation: (astroConfig) => {
		const plugins = getPlugins(new Set(), astroConfig.config.vite?.plugins);

		const { updateConfig } = astroConfig;

		astroConfig.updateConfig = (config) => {
			getPlugins(plugins, config.vite?.plugins);
			return updateConfig(config);
		};

		return (name: string) => plugins.has(name);
	},
});
