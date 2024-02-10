import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImport } from "../utilities/add-virtual-import.js";

export const addVirtualImportPlugin = definePlugin({
	name: "addVirtualImport",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }) =>
		({ name, content }: { name: string; content: string }) =>
			addVirtualImport({ name, content, updateConfig }),
});
