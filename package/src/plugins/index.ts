import { addDevToolbarFrameworkAppPlugin } from "./add-devtoolbar-framework-app.js";
import { addDtsPlugin } from "./add-dts.js";
import { addIntegrationPlugin } from "./add-integration.js";
import { addVirtualImportsPlugin } from "./add-virtual-imports.js";
import { addVitePluginPlugin } from "./add-vite-plugin.js";
import { hasIntegrationPlugin } from "./has-integration.js";
import { hasVitePluginPlugin } from "./has-vite-plugin.js";
import { injectDevRoutePlugin } from "./inject-dev-route.js";
import { watchIntegrationPlugin } from "./watch-integration.js";

export const corePlugins = [
	hasVitePluginPlugin,
	addDtsPlugin,
	addVirtualImportsPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	injectDevRoutePlugin,
	watchIntegrationPlugin,
	addDevToolbarFrameworkAppPlugin,
	addIntegrationPlugin,
] as const;

export {
	addDtsPlugin,
	addVirtualImportsPlugin,
	addVitePluginPlugin,
	hasIntegrationPlugin,
	hasVitePluginPlugin,
	injectDevRoutePlugin,
	watchIntegrationPlugin,
	addDevToolbarFrameworkAppPlugin,
	addIntegrationPlugin,
};
