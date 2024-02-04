import type { HookParameters } from "astro";
import type { Hooks, Plugin } from "./types.js";

export const definePlugin = <
	TName extends string,
	THook extends keyof Hooks,
	TImplementation extends (
		params: HookParameters<THook>,
		integrationOptions: { name: string },
	) => (...args: Array<any>) => any,
>(
	plugin: Plugin<TName, THook, TImplementation>,
) => plugin;