import { hasVitePluginPlugin } from "./has-vite-plugin.js";

export const corePlugins = [
	hasVitePluginPlugin, // Has to be the first plugin to detect Vite plugins added from inside the integration
] as const;

export { hasVitePluginPlugin };
