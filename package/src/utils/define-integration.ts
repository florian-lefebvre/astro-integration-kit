import type { AstroIntegration } from "astro";
import { defu } from "defu";
import { DEFAULT_HOOKS_NAMES } from "../internal/constants.js";
import { hookContext } from "../internal/context.js";

/**
 * Makes creating integrations easier, and adds a few goodies!
 *
 * @param {object} options
 * @param {string} options.name The name of your integration
 * @param {defaults} options.object Any default config options you want to set
 * @param {function} options.setup This will be called from your `astro:config:setup` call with the user options
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
 * 		setup(options) {
 * 			console.log(options.foo); // "bar"
 * 		}
 * })
 * ```
 */
export const defineIntegration = <
	TOptions extends Record<string, unknown> = never,
>({
	name,
	defaults,
	setup,
}: {
	name: string;
	defaults: {
		[Property in keyof TOptions]-?: TOptions[Property];
	};
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
