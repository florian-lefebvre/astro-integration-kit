import type { HookParameters } from "astro";
import type { HookName } from "../src/internal";

export const mockHookParams = <Hook extends HookName>(
	hookParameters: Partial<HookParameters<Hook>>,
) => hookParameters;
