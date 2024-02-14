import type { Options } from "../core/types.js";

/**
 * Allows defining an integration options while keeping the whole thing type-safe.
 *
 * @template TOptions - A generic for options need to be passed manually
 * @param {Required<TOptions>} defaults - Default value used as a fallback. Will be deeply merged with the user provided options
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-options/
 *
 * @example
 *
 * ```ts
 * type Options = {
 * 		name?: string | undefined
 * };
 *
 * export default defineIntegration({
 * 		// ...
 * 		options: defineOptions<Options>({ name: "abc" }),
 * })
 * ```
 */
export const defineOptions = <TOptions extends Record<string, unknown>>(
	defaults: Required<TOptions>,
): Options<TOptions> => ({
	options: {} as TOptions,
	defaults,
});
