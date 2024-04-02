import type { AstroIntegration } from "astro";
import type { NonEmptyArray } from "../internal/types.js";
import type {
	AnyPlugin,
	ExtendedHooks,
	HookParameters,
	Hooks,
} from "./types.js";

/**
 * Allows to extend hooks with custom parameters. Only used for advanced use-cases.
 *
 * @param {object} params
 * @param {string} params.name The integration name
 * @param {Array<AnyPlugin>} params.plugins
 * @param {import("astro".AstroIntegration["hooks"])} params.hooks
 */
export const withPlugins = <TPlugins extends NonEmptyArray<AnyPlugin>>({
	name,
	plugins,
	hooks: providedHooks,
}: { name: string; plugins: TPlugins; hooks: ExtendedHooks<TPlugins> }) => {
	// Overrides plugins with same name
	const resolvedPlugins = Object.values(
		Object.fromEntries(
			plugins.map((plugin) => [plugin.name, plugin.setup({ name })]),
		),
	) as Array<
		Partial<Record<keyof Hooks, (params: any) => Record<string, unknown>>>
	>;

	const definedHooks = Object.keys(providedHooks) as Array<keyof Hooks>;

	const hooks: AstroIntegration["hooks"] = Object.fromEntries(
		definedHooks.map((hookName) => [
			hookName,
			// We know all hook parameters are objects, but the generic correlation makes TS ignore that fact.
			// The intersection with `object` is a workaround so TS doesn't complain about the spread below.
			(params: object & HookParameters<typeof hookName>) => {
				const plugins = resolvedPlugins.filter((p) =>
					Object.keys(p).includes(hookName),
				);
				const additionalParams = plugins.reduce(
					(_params, plugin) => {
						// biome-ignore lint/style/noNonNullAssertion: We checked above already
						Object.assign(_params, plugin[hookName]!(params));
						return _params;
					},
					{} as Record<string, unknown>,
				);

				return providedHooks[hookName]?.({
					...additionalParams,
					...params,
				} as any);
			},
		]),
	);

	return hooks;
};
