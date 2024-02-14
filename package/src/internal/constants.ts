import type { Hooks } from "../core/types.js";

export const DEFAULT_HOOK_NAMES = [
	"astro:config:setup",
	"astro:config:done",
	"astro:server:setup",
	"astro:server:start",
	"astro:server:done",
	"astro:build:start",
	"astro:build:setup",
	"astro:build:generated",
	"astro:build:ssr",
	"astro:build:done",
] as const satisfies Array<keyof Hooks>;
