import type { DevToolbarApp } from "astro";
import type { Prettify } from "../internal/types.js";

export type PluginHooksConstraint = {
	[Hook in keyof Hooks]?: Record<string, unknown>;
};

type PluginPerHookSetup<THooks extends PluginHooksConstraint> = {
	[Hook in keyof THooks & keyof Hooks]: (
		...params: Parameters<Hooks[Hook]>
	) => THooks[Hook];
};

export type Plugin<
	TName extends string,
	THooks extends PluginHooksConstraint,
> = {
	name: TName;
	setup: (params: { name: string }) => PluginPerHookSetup<THooks>;
};

// To avoid having to call this manually for every generic
export type AnyPlugin = Plugin<string, Record<string, any>>;

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

/**
 * Turn the plugin into a simplified type representation of itself that can be more easily manipulated.
 *
 * No value of this type exists at runtime, it's only used for type manipulation.
 */
type SimplifyPlugin<TPlugin extends AnyPlugin = AnyPlugin> = {
	name: TPlugin["name"];
	hooks: TPlugin extends Plugin<any, infer THooks>
		? THooks
		: Record<string, never>;
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
			? undefined extends SimplifyPlugin<Head>["hooks"][THook]
				? // Drop plugin if the hook is not defined.
				  FilterPluginsByHook<THook, Tail>
				: [SimplifyPlugin<Head>, ...FilterPluginsByHook<THook, Tail>]
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
 * Compute plugin-added parameters for a hook.
 *
 * Plugins are applied in order, so the last plugin to define a parameter wins.
 * Plugins that don't define any value for the given hook are ignored.
 *
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

/**
 * Extend the signature of a function to receive extra parameters.
 *
 * Used to inject plugin-defined parameters into hooks.
 */
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
