import type { AstroIntegration } from "astro";
import { defu } from "defu";
import { DEFAULT_HOOKS_NAMES } from "../internal/constants.js";
import { hookContext } from "../internal/context.js";

/**
 * Makes creating integrations easier, and adds a few goodies!
 */
export const defineIntegration = <
	TOptions extends Record<string, unknown> = never,
>({
	name,
	defaults,
	setup,
}: {
	name: string;
	defaults: TOptions;
	setup: (params: {
		name: string;
		options: TOptions;
	}) => AstroIntegration["hooks"];
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
		const options = defu(_options, defaults ?? {}) as TOptions;

		const providedHooks = setup({ name, options });

		const hooks: AstroIntegration["hooks"] = {};
		for (const hookName of DEFAULT_HOOKS_NAMES) {
			if (providedHooks[hookName] !== undefined) {
				hooks[hookName] = (params) =>
					hookContext.callAsync({ [hookName]: params }, () =>
						// biome-ignore lint/style/noNonNullAssertion: existence checked above
						providedHooks[hookName]!(params as any),
					);
			}
		}

		return {
			name,
			hooks,
		};
	};
};
