import type { HookParameters, Hooks } from "./types.js";

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
	<TFn extends (params: HookParameters<THook>, ...args: Array<any>) => any>(
		fn: TFn,
	) =>
		fn;
