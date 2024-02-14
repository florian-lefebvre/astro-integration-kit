import { definePlugin } from "../core/define-plugin.js";
import { addIntegration, type addIntegrationUserParams } from '../utilities/add-integration.js';

export const addIntegrationPlugin = definePlugin({
	name: "addIntegration",
	hook: "astro:config:setup",
	implementation:
		({ updateConfig, config, logger }) =>
		(integration: addIntegrationUserParams) =>
            addIntegration({
                integration,
                updateConfig,
                config,
                logger,
            }),
});