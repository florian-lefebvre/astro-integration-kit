import type { AstroIntegration } from "astro";
import type { NonEmptyArray } from "../internal/types.js";
import type {
	AnyPlugin,
	ExtendedHooks,
	HookParameters,
	Hooks,
} from "./types.js";

/**
 * Allows to extend hooks with custom parameters. Advanced.
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
	const resolvedPlugins = Object.values(
		(() => {
			const _plugins: Record<string, AnyPlugin> = {};
			for (const plugin of plugins) {
				_plugins[plugin.name] = plugin;
			}
			return _plugins;
		})(),
	);

	const definedHooks = Object.keys(providedHooks) as Array<keyof Hooks>;

	const hooks: AstroIntegration["hooks"] = Object.fromEntries(
		definedHooks.map((hookName) => [
			hookName,
			// We know all hook parameters are objects, but the generic correlation makes TS ignore that fact.
			// The intersection with `object` is a workaround so TS doesn't complay about the spread below.
			(params: object & HookParameters<typeof hookName>) => {
				const plugins = resolvedPlugins.filter((p) => p.hook === hookName);

				return providedHooks[hookName]?.({
					...Object.fromEntries(
						plugins.map((plugin) => [
							plugin.name,
							plugin.implementation(params, { name }),
						]),
					),
					...params,
				} as any);
			},
		]),
	);

	return hooks;
};
