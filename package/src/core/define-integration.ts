import type { AstroIntegration } from "astro";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { errorMap } from "../internal/error-map.js";

type AstroIntegrationSetupFn<Options extends z.ZodTypeAny> = (params: {
	name: string;
	options: z.output<Options>;
}) => Omit<AstroIntegration, "name">;

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
	TSetup extends
		AstroIntegrationSetupFn<TOptionsSchema> = AstroIntegrationSetupFn<TOptionsSchema>,
>({
	name,
	optionsSchema,
	setup,
}: {
	name: string;
	optionsSchema?: TOptionsSchema | undefined;
	setup: TSetup;
}): ((
	...args: [z.input<TOptionsSchema>] extends [never]
		? []
		: undefined extends z.input<TOptionsSchema>
		  ? [options?: z.input<TOptionsSchema>]
		  : [options: z.input<TOptionsSchema>]
) => AstroIntegration & ReturnType<TSetup>) => {
	return (...args): AstroIntegration & ReturnType<TSetup> => {
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

		const integration = setup({ name, options }) as ReturnType<TSetup>;

		return {
			name,
			...integration,
		};
	};
};
