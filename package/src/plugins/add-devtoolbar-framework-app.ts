import { definePlugin } from "../core/define-plugin.js";
import {
	addDevToolbarFrameworkApp,
	type AddDevToolbarFrameworkAppParams,
} from "../utilities/add-devtoolbar-framework-app.js";

export const addDevToolbarFrameworkAppPlugin = definePlugin({
	name: "addDevToolbarFrameworkApp",
	hook: "astro:config:setup",
	implementation:
		({ addDevToolbarApp, updateConfig, injectScript }) =>
		(params: Omit<AddDevToolbarFrameworkAppParams, "addDevToolbarApp" | "updateConfig" | "injectScript">) =>
			addDevToolbarFrameworkApp({
				...params,
				addDevToolbarApp,
				updateConfig,
				injectScript,
			}),
});
