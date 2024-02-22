import type { AstroIntegration } from "astro";
import { definePlugin } from "../core/define-plugin.js";
import {
	addIntegration,
	type addIntegrationUserOptionalParams,
} from "../utilities/add-integration.js";

export const addIntegrationPlugin = definePlugin({
	name: "addIntegration",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
		(
			integration: AstroIntegration,
			options?: addIntegrationUserOptionalParams,
		) =>
			addIntegration({
				integration,
				...(options ? options : {}),
				updateConfig,
				config,
				logger,
			}),
});
