import type { AstroIntegration, HookParameters } from "astro";
import { defu } from "defu";
import type { AnyOptions, AnyPlugin, ExtendedHooks } from "./types.js";
import { DEFAULT_HOOK_NAMES } from "../internal/constants.js";

/**
 * A powerful wrapper around the standard Astro Integrations API. It allows to provide extra hooks, functionality
 * and best-practices when creating Astro Integrations.
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
 * export default defineIntegration({
 * 		name: "my-integration",
 * 		setup({ options }) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
export const defineIntegration = <
	TOptions extends AnyOptions = never,
	TPlugins extends Array<AnyPlugin> = [],
>({
	name,
	options: optionsDef,
	setup,
	plugins: _plugins,
}: {
	name: string;
	options?: TOptions;
	plugins?: TPlugins;
	setup: (params: {
		name: string;
		options: TOptions["options"];
	}) => ExtendedHooks<TPlugins>;
}): ((options?: TOptions["options"]) => AstroIntegration) => {
	return (_options?: TOptions["options"]) => {
		const options = defu(
			_options ?? {},
			optionsDef?.defaults ?? {},
		) as TOptions["options"];

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

		const hooks: AstroIntegration["hooks"] = Object.fromEntries(
			DEFAULT_HOOK_NAMES.map((hookName) => [
				hookName,
				(params: HookParameters<typeof hookName>) => {
					const plugins = resolvedPlugins.filter((p) => p.hook === hookName);

					return providedHooks[hookName]?.({
						...params,
						...Object.fromEntries(
							plugins.map((plugin) => [
								plugin.name,
								plugin.implementation(params, { name }),
							]),
						),
					} as any);
				},
			]),
		);

		return {
			name,
			hooks,
		};
	};
};
