import type { HookParameters } from "astro";
import type { HookName } from "../internal/types.js";
import { useHookContext } from "../internal/context.js";

export const useHookParams = <Hook extends HookName>(
	hook: Hook,
): HookParameters<Hook> => {
	const params = useHookContext()[hook];
	if (!params) {
		throw new Error(
			`\`useHookParams("${hook}")\` has not been called inside the "${hook}" hook.`,
		);
	}
	return params;
};
