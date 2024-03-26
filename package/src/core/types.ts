import type { DevToolbarApp } from "astro";
import type { Prettify, UnionToIntersection } from "../internal/types.js";

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
type SimplifyPlugins<TPlugins extends Array<AnyPlugin>> = {
	[K in keyof TPlugins]: SimplifyPlugin<TPlugins[K]>;
};

// This type is pretty crazy. It's a recursive type that allows to override
// plugins based on their name and hook. For instance, if we have:
// type A = Plugin<"test", "astro:config:setup", () => (param: number) => void>
// type B = Plugin<"test", "astro:config:done", () => () => void>
// type C = Plugin<"test", "astro:config:setup", () => (param: string) => void>
// type Input = [A,B,C]
// type Output = OverridePlugins<Input>
// 			^? [B,C]
//
// Basically, all the A extends ? B : never allow to narrow the types to make sure
// we get the right ones as input. Then, if there's already a plugin with the same
// name and hook as the currently checked plugin (Head), we Omit it and put the current
// type instead.
// biome-ignore lint/complexity/noBannedTypes: it doesn't work with anything else
type OverridePlugins<T extends Array<SimplifyPlugin>, U = {}> = T extends []
	? UnionToIntersection<U>
	: T extends [infer Head, ...infer Tail]
	  ? Head extends SimplifyPlugin
			? Tail extends Array<SimplifyPlugin>
				? Head["name"] extends keyof U
					? OverridePlugins<
							Tail,
							Omit<U, Head["name"]> & { [K in Head["name"]]: Head }
					  >
					: OverridePlugins<Tail, U & { [K in Head["name"]]: Head }>
				: never
			: never
	  : never;

type FilterPluginsByHook<
	THook extends keyof Hooks,
	TPlugins extends Record<string, SimplifyPlugin>,
> = {
	[K in keyof TPlugins]: THook extends keyof TPlugins[K]["hooks"]
		? TPlugins[K]["hooks"][THook]
		: never;
};

type OmitKeysByValue<T, ValueType> = {
	[Key in keyof T as T[Key] extends ValueType ? never : Key]: T[Key];
};

type MergeValues<T extends Record<string, Record<string, unknown>>> =
	UnionToIntersection<T[keyof T]>;

type AssertShape<T> = T extends Record<string, Record<string, unknown>>
	? T
	: never;

/**
 * @internal
 */
export type AddedParam<
	TPlugins extends Array<AnyPlugin>,
	THook extends keyof Hooks,
> = Prettify<
	MergeValues<
		AssertShape<
			OmitKeysByValue<
				FilterPluginsByHook<THook, OverridePlugins<SimplifyPlugins<TPlugins>>>,
				never
			>
		>
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
