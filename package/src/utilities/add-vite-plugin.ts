import type { HookParameters } from "astro";
import type { Plugin, PluginOption } from "vite";
import type { Prettify } from "../internal/types.js";
import { hasVitePlugin } from "./has-vite-plugin.js";

interface OptionA {
	warnDuplicated: true;
	plugin: PluginOption;
	config: HookParameters<"astro:config:setup">["config"];
	logger: HookParameters<"astro:config:setup">["logger"];
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}

interface OptionB {
	warnDuplicated?: false;
	plugin: PluginOption;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}

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
	warnDuplicated = true,
	plugin,
	config,
	logger,
	updateConfig,
}:
	| {
			warnDuplicated?: false | undefined;
			plugin: PluginOption;
			config: never;
			logger: never;
			updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
	  }
	| {
			warnDuplicated?: true;
			plugin: PluginOption;
			config: HookParameters<"astro:config:setup">["config"];
			logger: HookParameters<"astro:config:setup">["logger"];
			updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
	  }) => {
	if (warnDuplicated && hasVitePlugin({ plugin, config })) {
		logger.warn(
			`The Vite plugin "${
				(plugin as Plugin<any>).name
			}" is already present in your Vite configuration, this plugin may not behave correctly.`,
		);
	}

	updateConfig({
		vite: {
			plugins: [plugin],
		},
	});
};
