import type { HookParameters } from "astro";
import type {
	Prettify,
	UnionToArray,
	UnionToIntersection,
} from "../internal/types.js";

export type Plugin<
	TName extends string,
	THook extends keyof Hooks,
	TImplementation extends (
		params: HookParameters<THook>,
		integrationOptions: { name: string },
	) => (...args: Array<any>) => any,
> = {
	name: TName;
	hook: THook;
	implementation: TImplementation;
};

// To avoud having to call this manually for every generic
export type AnyPlugin = Plugin<string, keyof Hooks, any>;

export type Hooks = NonNullable<import("astro").AstroIntegration["hooks"]>;

// From an array of plugins, returns an array of plugins where the hook
// is the same as the THook generic. Otherwise, returns never.
type FilterPluginsByHook<
	TPlugins extends Array<AnyPlugin>,
	THook extends keyof Hooks,
> = Extract<TPlugins[number], { hook: THook }>;

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
type OverridePlugins<T extends Array<AnyPlugin>, U = {}> = T extends []
	? UnionToIntersection<U>
	: T extends [infer Head, ...infer Tail]
	  ? Head extends AnyPlugin
			? Tail extends Array<AnyPlugin>
				? Head["name"] extends keyof U
					? OverridePlugins<
							Tail,
							Omit<U, Head["name"]> & { [K in Head["name"]]: Head }
					  >
					: OverridePlugins<Tail, U & { [K in Head["name"]]: Head }>
				: never
			: never
	  : never;

// The result of UnionToArray if effectively an Array<AnyPlugin> but TS struggles
// to properly infer the right type. AssertPluginsArray just helps TS.
type AssertPluginsArray<T extends Array<unknown>> = T extends Array<AnyPlugin>
	? T
	: never;

// When we extend the params, we really only want to have this shape:
// {
//	  test: (param: string) => void
// }
// So this type maps over the object to actually return what we want.
type PluginsToImplementation<TPlugins extends Record<string, AnyPlugin>> = {
	[K in keyof TPlugins]: TPlugins[K] extends Plugin<
		infer _Name,
		infer _Hook,
		infer Implementation
	>
		? ReturnType<Implementation>
		: never;
};

/**
 * @internal
 */
export type AddedParam<
	TPlugins extends Array<AnyPlugin>,
	THook extends keyof Hooks,
> = Prettify<
	PluginsToImplementation<
		OverridePlugins<
			AssertPluginsArray<UnionToArray<FilterPluginsByHook<TPlugins, THook>>>
		>
	>
>;

type AddParam<Func, Param = never> = [Param] extends [never]
	? Func
	: Func extends (params: infer Params) => infer ReturnType
	  ? (params: Params & Param) => ReturnType
	  : never;

export interface ExtendedHooks<TPlugins extends Array<AnyPlugin>> {
	"astro:config:setup"?: AddParam<
		Hooks["astro:config:setup"],
		AddedParam<TPlugins, "astro:config:setup">
	>;
	"astro:config:done"?: AddParam<
		Hooks["astro:config:done"],
		AddedParam<TPlugins, "astro:config:done">
	>;
	"astro:server:setup"?: AddParam<
		Hooks["astro:server:setup"],
		AddedParam<TPlugins, "astro:server:setup">
	>;
	"astro:server:start"?: AddParam<
		Hooks["astro:server:start"],
		AddedParam<TPlugins, "astro:server:start">
	>;
	"astro:server:done"?: AddParam<
		Hooks["astro:server:done"],
		AddedParam<TPlugins, "astro:server:done">
	>;
	"astro:build:start"?: AddParam<
		Hooks["astro:build:start"],
		AddedParam<TPlugins, "astro:build:start">
	>;
	"astro:build:setup"?: AddParam<
		Hooks["astro:build:setup"],
		AddedParam<TPlugins, "astro:build:setup">
	>;
	"astro:build:generated"?: AddParam<
		Hooks["astro:build:generated"],
		AddedParam<TPlugins, "astro:build:generated">
	>;
	"astro:build:ssr"?: AddParam<
		Hooks["astro:build:ssr"],
		AddedParam<TPlugins, "astro:build:ssr">
	>;
	"astro:build:done"?: AddParam<
		Hooks["astro:build:done"],
		AddedParam<TPlugins, "astro:build:done">
	>;
}

export interface DevToolbarFrameworkAppProps {
	canvas: ShadowRoot;
	renderWindow: HTMLElement;
}
