import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation: ({ config, updateConfig }, { name }) => {
		let counter = 1;
		return (imports: Parameters<typeof addVirtualImports>[0]["imports"]) => {
			addVirtualImports({
				name: `${name}-${counter++}`,
				imports,
				config,
				updateConfig,
			});
		};
	},
});
