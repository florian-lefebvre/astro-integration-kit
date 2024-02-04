import { addDtsPlugin } from "./add-dts.js";
import { addVirtualImportPlugin } from "./add-virtual-import.js";
import { addVitePluginPlugin } from "./add-vite-plugin.js";

export const corePlugins = [
	addDtsPlugin,
	addVirtualImportPlugin,
	addVitePluginPlugin,
] as const;

export { addDtsPlugin, addVirtualImportPlugin, addVitePluginPlugin };
