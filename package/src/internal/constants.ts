import type { HookName } from "./types.js";

export const DEFAULT_HOOKS_NAMES = [
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
] satisfies Array<HookName>;
