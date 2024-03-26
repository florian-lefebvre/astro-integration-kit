import type { AstroIntegration } from "astro";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { errorMap } from "../internal/error-map.js";

/**
 * A powerful wrapper around the standard Astro Integrations API. It allows integration authors to handle user options and global logic easily.
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {import("astro/zod").AnyZodObject} params.optionsSchema - An optional zod schema to handle your integration options
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
	TOptionsSchema extends z.ZodTypeAny = z.ZodNever,
>({
	name,
	optionsSchema,
	setup,
}: {
	name: string;
	optionsSchema?: TOptionsSchema;
	setup: (params: {
		name: string;
		options: z.output<TOptionsSchema>;
	}) => AstroIntegration["hooks"];
}): ((
	...args: [z.input<TOptionsSchema>] extends [never]
		? []
		: undefined extends z.input<TOptionsSchema>
		  ? [options?: z.input<TOptionsSchema>]
		  : [options: z.input<TOptionsSchema>]
) => AstroIntegration) => {
	return (...args) => {
		const parsedOptions = (optionsSchema ?? z.never().optional()).safeParse(
			args[0],
			{
				errorMap,
			},
		);

		if (!parsedOptions.success) {
			throw new AstroError(
				`Invalid options passed to "${name}" integration\n`,
				parsedOptions.error.issues.map((i) => i.message).join("\n"),
			);
		}

		const options = parsedOptions.data as z.output<TOptionsSchema>;

		const hooks = setup({ name, options });

		return {
			name,
			hooks,
		};
	};
};
