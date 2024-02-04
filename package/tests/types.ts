import type { Plugin, AddedParam } from "../src/core/types.js";

type A = Plugin<"a", "astro:config:setup", () => (param: string) => boolean>;
type B = Plugin<"b", "astro:config:done", () => () => number>;
type C = Plugin<"c", "astro:config:done", () => () => string>;
type AOverride = Plugin<
	"a",
	"astro:config:setup",
	() => (test: number) => boolean
>;
type D = Plugin<"d", "astro:config:setup", () => () => boolean>;
type Plugins = [A, B, C, AOverride, D];

type X1 = AddedParam<Plugins, "astro:config:setup">;
type X2 = AddedParam<Plugins, "astro:config:done">;