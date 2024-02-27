import { definePlugin } from "../core/define-plugin.js";
import {
	type AddDevToolbarFrameworkAppParams,
	addDevToolbarFrameworkApp,
} from "../utilities/add-devtoolbar-framework-app.js";

export const addDevToolbarFrameworkAppPlugin = definePlugin({
	name: "addDevToolbarFrameworkApp",
	hook: "astro:config:setup",
	implementation:
		({ addDevToolbarApp, updateConfig, injectScript, config }) =>
		(
			params: Omit<
				AddDevToolbarFrameworkAppParams,
				"addDevToolbarApp" | "updateConfig" | "injectScript" | "config"
			>,
		) =>
			addDevToolbarFrameworkApp({
				...params,
				addDevToolbarApp,
				updateConfig,
				injectScript,
				config,
			}),
});
