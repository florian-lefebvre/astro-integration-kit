import { definePlugin } from "../core/define-plugin.js";
import {
	addIntegration,
	type AddIntegrationParams,
} from "../utilities/add-integration.js";

export const addIntegrationPlugin = definePlugin({
	name: "addIntegration",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
			(
				integration: Pick<AddIntegrationParams, "integration">["integration"],
				options?: Pick<AddIntegrationParams, "options">["options"],
			) =>
				addIntegration({
					integration,
					options: options ?? {},
					updateConfig,
					config,
					logger,
				}),
});
