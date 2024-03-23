import type { Plugin, PluginOption } from "vite";
import { defineUtility } from "../core/define-utility.js";
import { hasVitePlugin } from "./has-vite-plugin.js";

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {import("vite").PluginOption} options.plugin
 * @param {boolean} [options.warnDuplicated=true]
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 * addVitePlugin(params, {
 * 		plugin,
 * 		warnDuplicated: true,
 * })
 * ```
 */
export const addVitePlugin = defineUtility("astro:config:setup")(
	(
		params,
		{
			plugin,
			warnDuplicated = true,
		}: {
			plugin: PluginOption;
			warnDuplicated?: boolean;
		},
	) => {
		const { updateConfig, logger } = params;

		if (warnDuplicated && hasVitePlugin(params, { plugin })) {
			logger.warn(
				`The Vite plugin "${
					(plugin as Plugin).name
				}" is already present in your Vite configuration, this plugin may not behave correctly.`,
			);
		}

		updateConfig({
			vite: {
				plugins: [plugin],
			},
		});
	},
);
