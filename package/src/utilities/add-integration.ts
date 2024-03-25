import { type AstroIntegration } from "astro";
import { defineUtility } from "../core/define-utility.js";
import { hasIntegration } from "./has-integration.js";

export type AddIntegrationParams = {
	integration: AstroIntegration;
	ensureUnique?: boolean | undefined;
};

/**
 * Easily add an integration from within an integration.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {import("astro").AstroIntegration} options.integration
 * @param {boolean} options.ensureUnique
 *
 * @example
 * ```ts
 * import Vue from "@astrojs/vue";
 *
 * addIntegration(params, {
 * 	integration: Vue(),
 * 	ensureUnique: true,
 * })
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-integration/
 */
export const addIntegration = defineUtility("astro:config:setup")(
	(params, { integration, ensureUnique }: AddIntegrationParams) => {
		const { logger, updateConfig } = params;
		if (
			ensureUnique &&
			hasIntegration(params, {
				name: integration.name,
			})
		) {
			logger.warn(
				`Integration "${integration.name}" has already been added by the user or another integration. Skipping.`,
			);

			return;
		}

		updateConfig({
			integrations: [integration],
		});
	},
);
