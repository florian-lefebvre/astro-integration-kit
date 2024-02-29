import { definePlugin } from "../core/define-plugin.js";
import { addVirtualImports } from "../utilities/add-virtual-imports.js";

const pluginIndexMap: Record<string, number> = {};

export const addVirtualImportsPlugin = definePlugin({
	name: "addVirtualImports",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig }, { name }) =>
		(imports: Record<string, string>) => {
			pluginIndexMap[name] ??= -1;
			pluginIndexMap[name]++;
			addVirtualImports({
				name: `${name}-${pluginIndexMap[name]}`,
				imports,
				updateConfig,
			});
		},
});
