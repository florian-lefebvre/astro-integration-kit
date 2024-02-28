import { addDtsPlugin } from "./add-dts.js";
import { addVirtualImportsPlugin } from "./add-virtual-imports.js";
import { addVitePluginPlugin } from "./add-vite-plugin.js";
import { hasIntegrationPlugin } from "./has-integration.js";
import { injectDevRoutePlugin } from "./inject-dev-route.js";
import { watchIntegrationPlugin } from "./watch-integration.js";

export const corePlugins = [
	addDtsPlugin,
	addVirtualImportsPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	injectDevRoutePlugin,
	watchIntegrationPlugin,
] as const;

export {
	addDtsPlugin,
	addVirtualImportsPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	injectDevRoutePlugin,
	watchIntegrationPlugin,
};
