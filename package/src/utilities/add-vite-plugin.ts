import type { HookParameters } from "astro";
import type { Plugin, PluginOption } from "vite";
import { hasVitePlugin } from "./has-vite-plugin.js";

interface CommonOptions {
	plugin: PluginOption;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
}

interface NoWarnDuplicateOptions extends CommonOptions {
	warnDuplicated: false;
	config?: HookParameters<"astro:config:setup">["config"];
	logger?: HookParameters<"astro:config:setup">["logger"];
}

interface WarnDuplicateOptions extends CommonOptions {
	warnDuplicated?: true;
	config: HookParameters<"astro:config:setup">["config"];
	logger: HookParameters<"astro:config:setup">["logger"];
}

function incrementPluginName(plugin: Plugin) {
	let count = 1;
	plugin.name = `${plugin.name.replace(/-(\d+)$/, (_, c) => {
		count = parseInt(c) + 1;
		return "";
	})}-${count}`;
}

/**
 * Adds a [vite plugin](https://vitejs.dev/guide/using-plugins) to the
 * Astro config.
 *
 * @param {Params} params
 * @param {boolean} [params.warnDuplicated=true]
 * @param {import("vite").PluginOption} params.plugin
 * @param {import("astro").HookParameters<"astro:config:setup">["config"]} [params.config]
 * @param {import("astro").HookParameters<"astro:config:setup">["logger"]} [params.logger]
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-vite-plugin/
 *
 * @example
 * ```ts
 * addVitePlugin({
 * 		plugin,
 * 		config,
 * 		logger,
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
}: WarnDuplicateOptions | NoWarnDuplicateOptions) => {
	if (config && hasVitePlugin({ plugin, config })) {
		if (warnDuplicated && logger) {
			logger.warn(
				`The Vite plugin "${
					(plugin as Plugin).name
				}" is already present in your Vite configuration, this plugin may not behave correctly.`,
			);
		} else {
			incrementPluginName(plugin as Plugin);
			while (hasVitePlugin({ plugin, config }))
				incrementPluginName(plugin as Plugin);
		}
	}

	updateConfig({
		vite: {
			plugins: [plugin],
		},
	});
};
