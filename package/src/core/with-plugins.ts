import type { AstroIntegration, HookParameters } from "astro";
import type { NonEmptyArray, Prettify } from "../internal/types.js";
import type { AddedParam, AnyPlugin, ExtendedHooks, Hooks } from "./types.js";

type WithPluginsParams<TPlugins extends NonEmptyArray<AnyPlugin>> = {
	name: string;
	plugins: TPlugins;
	hooks: ExtendedHooks<TPlugins>;
};

export type WithPluginsReturn<Extensions> = Extensions &
	Omit<AstroIntegration, "name">;

/**
 * Allows to extend hooks with custom parameters. Only used for advanced use-cases.
 *
 * @param {object} params
 * @param {string} params.name The integration name
 * @param {Array<AnyPlugin>} params.plugins
 * @param {import("astro".AstroIntegration["hooks"])} params.hooks
 */
export const withPlugins = <
	TPlugins extends NonEmptyArray<AnyPlugin>,
	Extensions extends Record<any, unknown>,
>(
	options: WithPluginsParams<TPlugins> & Extensions,
): WithPluginsReturn<
	Prettify<Omit<Extensions, keyof WithPluginsParams<any>>>
> => {
	const {
		name,
		plugins,
		hooks: providedHooks,
		...remainingIntegrationObject
	} = options;

	// Overrides plugins with same name
	// Overrides plugins with same name, keeping only the last occurrence
	const resolvedPlugins = plugins
		.filter(
			(plugin, index, self) =>
				self.findLastIndex((other) => other.name === plugin.name) === index,
		)
		// Setup plugins with the integration parameters
		.map(
			(
				plugin,
			): Partial<
				Record<keyof Hooks, (params: any) => Record<string, unknown>>
			> => plugin.setup({ name }),
		);

	const definedHooks = (
		[
			...Object.keys(providedHooks),
			...resolvedPlugins.flatMap(Object.keys),
		] as Array<keyof Hooks>
	)
		// Deduplicate the hook names
		.filter((hookName, index, list) => list.indexOf(hookName) === index);

	const hooks: AstroIntegration["hooks"] = Object.fromEntries(
		definedHooks.map((hookName) => [
			hookName,
			// We know all hook parameters are objects, but the generic correlation makes TS ignore that fact.
			// The intersection with `object` is a workaround so TS doesn't complain about the spread below.
			(params: object & HookParameters<typeof hookName>) => {
				const plugins = resolvedPlugins.filter(
					(p): p is Required<Pick<typeof p, typeof hookName>> =>
						hookName in p && !!p[hookName],
				);

				const additionalParams = {} as AddedParam<TPlugins, typeof hookName>;

				for (const plugin of plugins) {
					Object.assign(additionalParams, plugin[hookName](params));
				}

				return providedHooks[hookName]?.({
					...additionalParams,
					...params,
				} as any);
			},
		]),
	);

	return {
		hooks,
		...remainingIntegrationObject,
	};
};
