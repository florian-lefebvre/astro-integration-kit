import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }, { name }) => {
			let counter = 1;
			return (imports: Record<string, string>) => {
				addVirtualImports({
					name: `${name}-${counter++}`,
					imports,
					updateConfig,
				});
			}
		},
});
