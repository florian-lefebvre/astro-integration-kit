import { addDevToolbarPluginPlugin } from "./add-devtoolbar-plugin.js";
import { addDtsPlugin } from "./add-dts.js";
import { addIntegrationPlugin } from "./add-integration.js";
import { addVirtualImportPlugin } from "./add-virtual-import.js";
import { addVitePluginPlugin } from "./add-vite-plugin.js";
import { hasIntegrationPlugin } from "./has-integration.js";
import { watchIntegrationPlugin } from "./watch-integration.js";

export const corePlugins = [
	addDtsPlugin,
	addVirtualImportPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	watchIntegrationPlugin,
	addDevToolbarPluginPlugin,
	addIntegrationPlugin,
] as const;

export {
	addDtsPlugin,
	addVirtualImportPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	watchIntegrationPlugin,
	addDevToolbarPluginPlugin,
	addIntegrationPlugin,
};
