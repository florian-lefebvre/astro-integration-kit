import type { HookParameters } from "astro";
import { useHookContext } from "./context.js";
import type { HookName } from "./types.js";

export const useHookParams = <Hook extends HookName>(
	hook: Hook,
): HookParameters<Hook> => {
	const error = `\`useHookParams("${hook}")\` has not been called inside the "${hook}" hook.`;

	try {
		const params = useHookContext()[hook];
		if (!params) {
			throw new Error(error);
		}
		return params;
	} catch (_) {
		throw new Error(error);
	}
};
