import type { Plugin, PluginHooksConstraint } from "./types.js";

/**
 * Allows defining a type-safe plugin that can be used in {defineIntegration}.
 *
 * @param {object} plugin
 * @param {string} plugin.name - The name of the plugin, as you want it to be called from the hook
 * @param {string} plugin.hook - The name of the hook where this plugin should be available
 * @param {Function} plugin.implementation - The actual function definition. Refer to docs for usage
 *
 * @see https://astro-integration-kit.netlify.app/core/define-plugin/
 *
 * ```ts
 * import { definePlugin } from "../core/define-plugin.js";
 * import { addVitePlugin } from "../utilities/add-vite-plugin.js";
 * import type { Plugin as VitePlugin } from "vite"
 *
 * export const addVitePluginPlugin = definePlugin({
 * 		name: "addVitePlugin",
 * 		hook: "astro:config:setup",
 * 		implementation: ({ updateConfig }) => (plugin: VitePlugin) => addVitePlugin({ plugin, updateConfig }),
 * });
 * ```
 */
export const definePlugin = <
	TName extends string,
	THooks extends PluginHooksConstraint,
>(
	plugin: Plugin<TName, THooks>,
) => plugin;
