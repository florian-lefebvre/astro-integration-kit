import type { Plugin as VitePlugin } from "vite";
import { definePlugin } from "../core/define-plugin.js";
import { addVitePlugin } from "../utilities/add-vite-plugin.js";

export const addVitePluginPlugin = definePlugin({
	name: "addVitePlugin",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		(plugin: VitePlugin) =>
			addVitePlugin({ plugin, updateConfig }),
});
