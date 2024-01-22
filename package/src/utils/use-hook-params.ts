import type { HookParameters } from "astro";
import { ctx } from "./define-integration.js";

export const useHookParams = (
	string: "astro:config:setup",
): HookParameters<"astro:config:setup"> => {
    return ctx.use()
};
