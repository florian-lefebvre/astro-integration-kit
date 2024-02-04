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
		integrationOptions: { name: string }
	) => (...args: Array<any>) => any,
> = {
	name: TName;
	hook: THook;
	implementation: TImplementation;
};

export type AnyPlugin = Plugin<string, keyof Hooks, any>;

export type Hooks = NonNullable<import("astro").AstroIntegration["hooks"]>;

type FilterPluginsByHook<
	TPlugins extends Array<AnyPlugin>,
	THook extends keyof Hooks,
> = Extract<TPlugins[number], { hook: THook }>;

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

type AssertPluginsArray<T extends Array<unknown>> = T extends Array<AnyPlugin>
	? T
	: never;

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

type AddParam<Func, Param = Record<never, never>> = Func extends (
	params: infer Params,
) => infer ReturnType
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

export type Options<TOptions extends Record<string, unknown>> = {
	options: TOptions;
	defaults: Required<TOptions>;
};

export type AnyOptions = Options<any>;
