import type { HookParameters } from "astro";
import type { Hooks } from "./types.js";

/**
 * A utility to be used on an Astro hook.
 *
 * @see defineUtility
 */
export type HookUtility<
	THook extends keyof Hooks,
	TArgs extends Array<any>,
	TReturn,
> = (params: HookParameters<THook>, ...args: TArgs) => TReturn;

/**
 * Allows defining a type-safe function requiring all the params of a given hook.
 * It uses currying to make TypeScript happy.
 *
 * @param {string} _hook
 *
 * @see https://astro-integration-kit.netlify.app/utilities/define-utility/
 *
 * @example
 * ```ts
 * const test = defineUtility("astro:config:setup")((params, foo: boolean) => {
 *  return "bar";
 * });
 * ```
 */
export const defineUtility =
	<THook extends keyof Hooks>(_hook: THook) =>
	/**
	 * The function itself
	 * @param {Function} fn;
	 */
	<TArgs extends Array<any>, T>(
		fn: HookUtility<THook, TArgs, T>,
	): HookUtility<THook, TArgs, T> =>
		fn;
