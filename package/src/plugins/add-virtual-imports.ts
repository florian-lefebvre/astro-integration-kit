import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		({ name, content }: { name: string; content: string }) =>
			addVirtualImports({ name, content, updateConfig }),
});
