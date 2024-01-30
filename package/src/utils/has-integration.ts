import type { HookParameters } from "astro";

/**
 * Checks whether an integration is already installed.
 *
 * If `before` is given, returns true only if the integration is installed before the named|provided integration.
 * If `after` is given, returns true only if the integration is installed after the named|provided integration.
 *
 * @param {object} params
 * @param {string} params.name Integration to look up.
 * @param {string} params.before Check if the named integration is installed before this.
 * @param {string} params.after Check if the named integration is installed after this.
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
	before,
	after,
	config,
}: {
	name: string;
	before?: string;
	after?: string;
	config: HookParameters<"astro:config:setup">["config"];
}): boolean => {
	const integrationPosition = config.integrations.findIndex((integration) => integration.name === name);

	// Integration is not installed
	if (integrationPosition === -1) return false;

	if (before !== undefined) {
		const otherPosition = config.integrations.findIndex((integration) => integration.name === before);

		// Integration is after the other, so it is not before.
		if (otherPosition !== -1 && integrationPosition > otherPosition) return false;
	}

	if (after !== undefined) {
		const otherPosition = config.integrations.findIndex((integration) => integration.name === after);

		// Integration is before the other, so it is not after.
		if (otherPosition !== -1 && integrationPosition > otherPosition) return false;
	}

	return true;
};

