import type { Options } from "../core/types.js";

/**
 * Allows defining an integration options while keeping the whole thing type-safe.
 *
 * @template TOptions - A generic for options need to be passed manually
 * @param {object} options
 * @param {import("astro/zod").AnyZodObject} options.schema
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
export const defineOptions = <TOptions extends Record<string, unknown>>({
	schema,
}: { schema: import("astro/zod").AnyZodObject }): Options<TOptions> => ({
	options: {} as TOptions,
	schema,
});
