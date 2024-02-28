import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		(imports: Record<string, string>) =>
			addVirtualImports({ imports, updateConfig }),
});
