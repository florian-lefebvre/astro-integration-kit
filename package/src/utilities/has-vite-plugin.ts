import type { AstroConfig } from "astro";
import type { PluginOption } from "vite";
import { defineUtility } from "../core/define-utility.js";

function getPluginNames(plugins: AstroConfig["vite"]["plugins"]) {
	const names: string[] = [];

	if (plugins) {
		for (const plugin of plugins) {
			if (!plugin) continue;

			if (Array.isArray(plugin)) {
				names.push(...getPluginNames(plugin));
				continue;
			}

			if (plugin instanceof Promise) {
				continue;
			}

			names.push(plugin.name);
		}
	}

	return names;
}

/**
 * Checks for the existence of a Vite plugin inside the Astro config.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {Params} options
 * @param {string | import("vite").PluginOption} options.plugin
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-vite-plugin/
 *
 * @example
 * ```ts
 * hasVitePlugin(params, {
 * 		plugin: "vite-plugin-my-integration",
 * })
 * ```
 */
export const hasVitePlugin = defineUtility("astro:config:setup")(
	(
		{ config },
		{
			plugin,
		}: {
			plugin: string | PluginOption;
		},
	): boolean => {
		if (!plugin || plugin instanceof Promise) return false;

		const currentPlugins = new Set(getPluginNames(config?.vite?.plugins));

		const plugins = new Set<string>();

		if (typeof plugin === "string") {
			plugins.add(plugin);
		}

		if (typeof plugin === "object") {
			if (Array.isArray(plugin)) {
				const names = new Set(
					getPluginNames(plugin as NonNullable<AstroConfig["vite"]["plugins"]>),
				);
				for (const name of names) plugins.add(name);
			} else {
				plugins.add(plugin.name);
			}
		}

		return [...plugins].some((name) => currentPlugins.has(name));
	},
);
