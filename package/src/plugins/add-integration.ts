import { definePlugin } from "../core/define-plugin.js";
import {
	addIntegration,
	type addIntegrationParams,
} from "../utilities/add-integration.js";

export const addIntegrationPlugin = definePlugin({
	name: "addIntegration",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
		(
			integration: Pick<addIntegrationParams, "integration">,
			ensureUnique?: Pick<addIntegrationParams, "ensureUnique">,
		) =>
			addIntegration({
				integration,
				ensureUnique,
				updateConfig,
				config,
				logger,
			}),
});
