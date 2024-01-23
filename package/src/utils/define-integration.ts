import type { AstroIntegration } from "astro";
import { z } from "astro/zod";
import { DEFAULT_HOOKS_NAMES } from "../internal/constants.js";
import { hookContext } from "../internal/context.js";

export const defineIntegration = <
	TOptionsSchema extends z.ZodDefault<z.AnyZodObject>,
	TOptions = z.infer<TOptionsSchema>,
>({
	name,
	options: optionsSchema,
	setup,
}: {
	name: AstroIntegration["name"];
	options: TOptionsSchema;
	setup: (options: Required<TOptions>) => AstroIntegration["hooks"];
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
		const options = optionsSchema?.parse(_options) as any as Required<TOptions>;

		const providedHooks = setup(options);

		const hooks: AstroIntegration["hooks"] = {};
		for (const hookName of DEFAULT_HOOKS_NAMES) {
			hooks[hookName] = (params) =>
				hookContext.callAsync({ [hookName]: params }, () =>
					providedHooks[hookName]?.(params as any),
				);
		}

		return {
			name,
			hooks,
		};
	};
};
