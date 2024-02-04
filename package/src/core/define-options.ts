import type { Options } from "../core/types.js";

export const defineOptions = <TOptions extends Record<string, unknown>>(
	defaults: Required<TOptions>,
): Options<TOptions> => ({
	options: {} as TOptions,
	defaults,
});
