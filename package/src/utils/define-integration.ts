import type { AstroIntegration } from "astro";
import { defu } from "defu";
import type { AnyPlugin, ExtendedHooks } from "../types.js";
import { addDts } from "./add-dts.js";
import { addVirtualImport } from "./add-virtual-import.js";
import { addVitePlugin } from "./add-vite-plugin.js";
import { hasIntegration } from "./has-integration.js";
import { watchIntegration } from "./watch-integration.js";
import { definePlugin } from "./define-plugin.js";

const testPlugin = definePlugin({
	name: "addVitePlugin",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		(plugin: Parameters<typeof addVitePlugin>[0]["plugin"]) => {
			addVitePlugin({ plugin, updateConfig });
		},
});

const testIntegration = defineIntegration({
	name: "test-integration",
	plugins: [testPlugin],
	setup() {
		return {
			"astro:config:setup": ({ addVitePlugin }) => {},
		};
	},
});

/**
 * Makes creating integrations easier, and adds a few goodies!
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {object} params.object - Any default config options you want to set
 * @param {function} params.setup - This will be called from your `astro:config:setup` call with the user options
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-integration/
 *
 * @example
 * ```ts
 * export default defineIntergration({
 *		name: "my-integration",
 *		defaults: {
 *    		foo: "bar",
 * 		},
 * 		setup({ options }) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
export const defineIntegration = <
	TOptions extends Record<string, unknown> = never,
	TPlugins extends Array<AnyPlugin> = [],
>({
	name,
	defaults,
	setup,
	plugins: _plugins,
}: {
	name: string;
	defaults?: Required<TOptions>;
	setup: (params: {
		name: string;
		options: TOptions;
	}) => ExtendedHooks<TPlugins>;
	plugins?: TPlugins;
}): ((options?: TOptions) => AstroIntegration) => {
	return (_options?: TOptions) => {
		const options = defu(_options ?? {}, defaults ?? {}) as TOptions;

		const resolvedPlugins = Object.values(
			(() => {
				const plugins: Record<string, AnyPlugin> = {};
				for (const plugin of _plugins ?? []) {
					plugins[plugin.name] = plugin;
				}
				return plugins;
			})(),
		);

		const providedHooks = setup({ name, options });

		const hooks: AstroIntegration["hooks"] = {
			"astro:config:setup": (params) => {
				const plugins = resolvedPlugins.filter(
					(p) => p.hook === "astro:config:setup",
				);

				return providedHooks["astro:config:setup"]?.({
					...params,
					...Object.fromEntries(
						plugins.map((plugin) => [
							plugin.name,
							plugin.implementation(params),
						]),
					),
					// addDts: ({ name, content }) =>
					// 	addDts({
					// 		name,
					// 		content,
					// 		logger: params.logger,
					// 		root: params.config.root,
					// 		srcDir: params.config.srcDir,
					// 	}),
					// addVirtualImport: ({ name, content }) =>
					// 	addVirtualImport({
					// 		name,
					// 		content,
					// 		updateConfig: params.updateConfig,
					// 	}),
					// addVitePlugin: (plugin) =>
					// 	addVitePlugin({ plugin, updateConfig: params.updateConfig }),
					// hasIntegration: (
					// 	_name: string,
					// 	position?: "before" | "after",
					// 	relativeTo?: string,
					// ) =>
					// 	hasIntegration({
					// 		name: _name,
					// 		// When `relativeTo` is not set get positions relative the current integration.
					// 		relativeTo: relativeTo ?? name,
					// 		position,
					// 		config: params.config,
					// 	}),
					// watchIntegration: (dir) =>
					// 	watchIntegration({
					// 		command: params.command,
					// 		dir,
					// 		addWatchFile: params.addWatchFile,
					// 		updateConfig: params.updateConfig,
					// 	}),
				} as any);
			},
			"astro:config:done": (params) => {
				return providedHooks["astro:config:done"]?.({ ...params });
			},
			"astro:server:setup": (params) => {
				return providedHooks["astro:server:setup"]?.({ ...params });
			},
			"astro:server:start": (params) => {
				return providedHooks["astro:server:start"]?.({ ...params });
			},
			"astro:server:done": (params) => {
				return providedHooks["astro:server:done"]?.({ ...params });
			},
			"astro:build:start": (params) => {
				return providedHooks["astro:build:start"]?.({ ...params });
			},
			"astro:build:setup": (params) => {
				return providedHooks["astro:build:setup"]?.({ ...params });
			},
			"astro:build:generated": (params) => {
				return providedHooks["astro:build:generated"]?.({ ...params });
			},
			"astro:build:ssr": (params) => {
				return providedHooks["astro:build:ssr"]?.({ ...params });
			},
			"astro:build:done": (params) => {
				return providedHooks["astro:build:done"]?.({ ...params });
			},
		};

		return {
			name,
			hooks,
		};
	};
};
