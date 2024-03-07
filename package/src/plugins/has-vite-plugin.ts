import type { AstroConfig } from "astro";
import { PluginOption } from "vite";
import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

function getPlugins(
	store: Set<
		Extract<
			NonNullable<NonNullable<AstroConfig["vite"]["plugins"]>[number]>,
			{ name: string }
		>
	>,
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
	implementation: (params) => {
		const currentPlugins = getPlugins(
			new Set(),
			params.config.vite?.plugins,
		);

		const { updateConfig } = params;

		params.updateConfig = (config) => {
			params.config.vite.plugins = [
				...getPlugins(currentPlugins, config.vite?.plugins),
			];
			return updateConfig(config);
		};

		return (plugin: string | PluginOption) =>
			hasVitePlugin({
				plugin,
				config: params.config,
			});
	},
});
