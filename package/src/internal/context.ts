import { AsyncLocalStorage } from "node:async_hooks";
import type { HookParameters } from "astro";
import { createContext } from "unctx";
import type { HookName } from "../internal/types.js";

export const hookContext = createContext<
	Partial<{
		[Hook in HookName]: HookParameters<Hook>;
	}>
>({
	asyncContext: true,
	AsyncLocalStorage,
});

export const useHookContext = hookContext.use;
