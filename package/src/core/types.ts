import type { DevToolbarApp } from "astro";
import type { Prettify } from "../internal/types.js";

export type PluginHooksConstraint = {
	[Hook in keyof Hooks]?: (
		...args: Parameters<Hooks[Hook]>
	) => Record<string, unknown>;
};

export type Plugin<
	TName extends string,
	THooks extends PluginHooksConstraint,
> = {
	name: TName;
	setup: (params: { name: string }) => THooks;
};

// To avoid having to call this manually for every generic
export type AnyPlugin = Plugin<string, Record<string, unknown>>;

declare global {
	namespace AstroIntegrationKit {
		// biome-ignore lint/suspicious/noEmptyInterface: Requires for interface merging
		export interface ExtraHooks {}
	}
}

export type Hooks = Prettify<
	Required<NonNullable<import("astro").AstroIntegration["hooks"]>> &
		AstroIntegrationKit.ExtraHooks
>;

export type HookParameters<T extends keyof Hooks> = Parameters<Hooks[T]>[0];

type AnyFunction = (...args: Array<any>) => any;

type SimplifyPlugin<TPlugin extends AnyPlugin = AnyPlugin> = {
	name: TPlugin["name"];
	hooks: {
		[K in keyof ReturnType<TPlugin["setup"]>]: ReturnType<
			TPlugin["setup"]
		>[K] extends AnyFunction
			? ReturnType<ReturnType<TPlugin["setup"]>[K]>
			: never;
	};
};

/**
 * Return a tuple of simplified plugins that affect the given hook.
 *
 * Plugins that don't affect the hook are removed from the tuple. The order of the tuple is preserved.
 *
 * @internal
 */
type FilterPluginsByHook<
	THook extends keyof Hooks,
	TPlugins extends Array<AnyPlugin>,
> = TPlugins extends [infer Head, ...infer Tail]
	? Head extends AnyPlugin
		? Tail extends Array<AnyPlugin>
			? THook extends keyof SimplifyPlugin<Head>["hooks"]
				? // Handle explicitly undefined hooks
				  undefined extends SimplifyPlugin<Head>["hooks"][THook]
					? FilterPluginsByHook<THook, Tail>
					: [SimplifyPlugin<Head>, ...FilterPluginsByHook<THook, Tail>]
				: []
			: []
		: []
	: [];

type OmitKeysByValue<T, ValueType> = {
	[Key in keyof T as T[Key] extends ValueType ? never : Key]: T[Key];
};

// This type is pretty crazy. It's a recursive type that allows to override
// params defined by previous hooks. Example:
// type A = Plugin<"test", {"astro:config:setup": () => {foo: () => string}}>
// type B = Plugin<"test", {"astro:config:setup": () => {bar: () => number}}>
// type C = Plugin<"test", {"astro:config:setup": () => {foo: () => boolean}}>
// type Input = [A,B,C]
// type Output = OverridePluginParamsForHook<Input>
// 			^? {foo: () => boolean, bar: () => number}
//
// biome-ignore lint/complexity/noBannedTypes: it doesn't work with anything else
type OverridePluginParamsForHook<
	THook extends keyof Hooks,
	TPlugins extends Array<SimplifyPlugin>,
> = TPlugins extends [...infer Head, infer Tail]
	? Tail extends SimplifyPlugin
		? Head extends SimplifyPlugin[]
			? Omit<
					OverridePluginParamsForHook<THook, Head>,
					keyof Tail["hooks"][THook]
			  > &
					Tail["hooks"][THook]
			: never
		: never
	: Record<never, never>;

/**
 * @internal
 */
export type AddedParam<
	TPlugins extends Array<AnyPlugin>,
	THook extends keyof Hooks,
> = Prettify<
	OmitKeysByValue<
		OverridePluginParamsForHook<THook, FilterPluginsByHook<THook, TPlugins>>,
		never
	>
>;

type AddParam<Func, Param = never> = [Param] extends [never]
	? Func
	: Func extends (params: infer Params) => infer ReturnType
	  ? (params: Params & Param) => ReturnType
	  : never;

export type ExtendedHooks<TPlugins extends Array<AnyPlugin>> = {
	[Hook in keyof Hooks]?: Hooks[Hook] extends AnyFunction
		? AddParam<Hooks[Hook], AddedParam<TPlugins, Hook>>
		: never;
};

export interface DevToolbarFrameworkAppProps {
	canvas: Parameters<Required<DevToolbarApp>["init"]>[0];
	eventTarget: Parameters<Required<DevToolbarApp>["init"]>[1];
	renderWindow: HTMLElementTagNameMap["astro-dev-toolbar-window"];
}
