import type { AstroIntegration, HookParameters } from "astro";
import { z } from "astro/zod";
import { createContext, withAsyncContext } from "unctx";
import { AsyncLocalStorage } from "node:async_hooks";

export const ctx = createContext<HookParameters<'astro:config:setup'>>({
	asyncContext: true,
	AsyncLocalStorage,
});

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
	defaultOptions: Required<TOptions>;
	setup: (options: Required<TOptions>) => AstroIntegration["hooks"];
}): ((options: TOptions) => AstroIntegration) => {
	return (_options) => {
		const options: Required<TOptions> =
			(optionsSchema?.parse(_options) as any) ?? defaultOptions;

		const providedHooks = setup(options);

		const hooks: AstroIntegration["hooks"] = {
			"astro:config:setup": (params) =>
				ctx.callAsync(
					params,
					withAsyncContext(async () => {
						return await providedHooks["astro:build:setup"]?.(params as any);
					}),
				),
		};

		return {
			name,
			hooks,
		};
	};
};
