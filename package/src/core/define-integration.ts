import type { AstroIntegration } from "astro";
import { AstroError } from "astro/errors";
import { z } from "astro/zod";
import { errorMap } from "../internal/error-map.js";
import type { ExtendedPrettify } from "../internal/types.ts";
import type { Hooks } from "./types.js";

type AstroIntegrationSetupFn<Options extends z.ZodTypeAny, TApi> = (params: {
	name: string;
	options: z.output<Options>;
}) => Omit<AstroIntegration, "name" | "hooks"> & TApi & {
	// Enable autocomplete and intellisense for non-core hooks
	hooks: Partial<Hooks>,
};

/**
 * A powerful wrapper around the standard Astro Integrations API. It allows integration authors to handle user options and global logic easily.
 *
 * @param {object} params
 * @param {string} params.name - The name of your integration
 * @param {import("astro/zod").AnyZodObject} params.optionsSchema - An optional zod schema to handle your integration options
 * @param {function} params.setup - This will be called from your `astro:config:setup` call with the user options
 *
 * @see https://astro-integration-kit.netlify.app/core/define-integration/
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
  TApiBase,
	// Apply Prettify on a generic type parameter so it goes through
	// the type expansion and beta reduction to form a minimal type
	// for the emitted declarations on libraries.
  TApi extends ExtendedPrettify<Omit<TApiBase, keyof AstroIntegration>>,
	TOptionsSchema extends z.ZodTypeAny = z.ZodNever,
>({
	name,
	optionsSchema,
	setup,
}: {
	name: string;
	optionsSchema?: TOptionsSchema;
	setup: AstroIntegrationSetupFn<TOptionsSchema, TApiBase>;
}): ((
	...args: [z.input<TOptionsSchema>] extends [never]
		? []
		: undefined extends z.input<TOptionsSchema>
		  ? [options?: z.input<TOptionsSchema>]
		  : [options: z.input<TOptionsSchema>]
) => AstroIntegration & TApi) => {
	return (...args): AstroIntegration & TApi => {
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

		const {hooks, ...extra} = setup({ name, options });

		return {
			...extra as unknown as TApi,
			hooks,
			name,
		};
	};
};
