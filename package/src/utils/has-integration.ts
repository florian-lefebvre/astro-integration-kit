import type { HookParameters } from "astro";

/**
 * Checks whether an integration is already installed.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {config} params.config
 *
 * @returns {boolean}
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
 *
 * @example
 * ```ts
 *  hasIntegration({
 * 		name: "@astrojs/tailwind",
 * 		config
 * 	})
 * ```
 */
export const hasIntegration = ({
	name,
	config,
}: {
	name: string;
	config: HookParameters<"astro:config:setup">["config"];
}): boolean => {
	return !!config.integrations.find((integration) => integration.name === name);
};
