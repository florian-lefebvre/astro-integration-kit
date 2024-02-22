import { definePlugin } from "../core/define-plugin.js";
import {
	addDevToolbarFrameworkApp,
	type addDevToolbarFrameworkAppUserParams,
} from "../utilities/add-devtoolbar-framework-app.js";

export const addDevToolbarFrameworkAppPlugin = definePlugin({
	name: "addDevToolbarFrameworkApp",
	hook: "astro:config:setup",
	implementation:
		({ addDevToolbarApp, updateConfig, injectScript }) =>
		(params: addDevToolbarFrameworkAppUserParams) =>
			addDevToolbarFrameworkApp({
				...params,
				addDevToolbarApp,
				updateConfig,
				injectScript,
			}),
});
