import { definePlugin } from "./define-plugin.js";
import type { Hooks, Plugin } from "./types.js";

export type AllHooksPluginDefinition<
	TName extends string,
	TApi extends Record<string, unknown>,
> = {
	name: TName;
	setup: (
		...params: Parameters<AllHooksPlugin<TName, TApi>["setup"]>
	) => <H extends keyof Hooks>(
		hookName: H,
	) => (...hookParams: Parameters<Hooks[H]>) => TApi;
};

/**
 * A plugin that exposes the same API for all hooks.
 */
export type AllHooksPlugin<
	TName extends string,
	TApi extends Record<string, unknown>,
> = Plugin<TName, Record<keyof Hooks, TApi>>;

/**
 * Allows defining a type-safe plugin that can be used from any Astro hook.
 *
 * This wraps {@link definePlugin} and receives a factory for the API to be
 * called dynamically for each hook. This allows plugins to support any hook
 * even those added by new versions of astro or hooks added by other integrations.
 *
 * @see https://astro-integration-kit.netlify.app/core/define-plugin/
 */
export const defineAllHooksPlugin = <
	TName extends string,
	TApi extends Record<string, unknown>,
>(
	plugin: AllHooksPluginDefinition<TName, TApi>,
): AllHooksPlugin<TName, TApi> =>
	definePlugin({
		...plugin,
		setup: (...params) => {
			const hookFactory = plugin.setup(...params);

			return new Proxy(
				Object.freeze({}) as ReturnType<Plugin<any, any>["setup"]>,
				{
					has: (_, prop) => typeof prop === "string",
					get: (_, prop) => hookFactory(prop as keyof Hooks),
				},
			);
		},
	});
