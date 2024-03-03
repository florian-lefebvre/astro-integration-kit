import { definePlugin } from "../core/define-plugin.js";
import { hasVitePlugin } from "../utilities/has-vite-plugin.js";

export const hasVitePluginPlugin = definePlugin({
	name: "hasVitePlugin",
	hook: "astro:config:setup",
	implementation:
		({ config }) =>
		(name: string) =>
			hasVitePlugin({
				name,
        config
			}),
});
