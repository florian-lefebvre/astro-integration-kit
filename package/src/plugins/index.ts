import { addDtsPlugin } from "./add-dts.js";
import { addVirtualImportPlugin } from "./add-virtual-import.js";
import { addVitePluginPlugin } from "./add-vite-plugin.js";
import { hasIntegrationPlugin } from "./has-integration.js"

export const corePlugins = [
	addDtsPlugin,
	addVirtualImportPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
] as const;

export {
	addDtsPlugin,
	addVirtualImportPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
};
