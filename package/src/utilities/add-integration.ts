import { type AstroIntegration, type HookParameters } from "astro";
import { hasIntegration } from "./has-integration.js";

export type addIntegrationUserParams = AstroIntegration;

type AddIntegrationParams = { integration: addIntegrationUserParams } & {
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
	config: HookParameters<"astro:config:setup">["config"];
	logger: HookParameters<"astro:config:setup">["logger"];
};

/**
 * Easily add an integration from within an integration.
 *
 * @param {import("astro").AstroIntegration} integration
 * @param {import("astro").HookParameters<"astro:config:setup">["updateConfig"]} params.updateConfig
 * @param {import("astro").HookParameters<"astro:config:setup">["config"]} params.config
 * @param {import("astro").HookParameters<"astro:config:setup">["logger"]} params.logger
 *
 * @example
 * ```ts
 * import Vue from "@astrojs/vue";
 *
 * addIntegration(Vue())
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-integration/
 */
export const addIntegration = ({
	integration,
	updateConfig,
	config,
	logger,
}: AddIntegrationParams) => {
	if (
		hasIntegration({
			name: integration.name,
			config,
		})
	) {
		logger.warn(
			`Trying to add integration "${integration.name}. Already added to Astro."`,
		);
	}

	updateConfig({
		integrations: [integration],
	});
};
