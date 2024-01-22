import type { AstroIntegration } from "astro";
import { z } from "astro/zod";

// TODO: improve UX around options + defaultOptions
export const defineIntegration = <
	TOptionsSchema extends z.AnyZodObject,
	TOptions = z.infer<TOptionsSchema>,
>({
	name,
	options: optionsSchema,
    defaultOptions,
	setup,
}: {
	name: AstroIntegration["name"];
	options: TOptionsSchema;
    defaultOptions: Required<TOptions>
    setup: (options: Required<TOptions>) => AstroIntegration["hooks"]
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
        const options: Required<TOptions> = optionsSchema?.parse(_options) as any ?? defaultOptions;
        const hooks = setup(options)

		return {
			name,
			hooks,
		};
	};
};
