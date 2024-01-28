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

/**
 * Checks whether a target integration was installed before the current integration.
 *
 * @param {object} params
 * @param {string} params.current Integration doing the lookup.
 * @param {string} params.target Integration to find before current.
 * @param {config} params.config
 *
 * @returns {boolean}
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
 *
 * @example
 * ```ts
 *  hasPreviousIntegration({
 * 		current: "my-integration",
 * 		target: "@astrojs/tailwind",
 * 		config
 * 	})
 * ```
 */
export const hasPreviousIntegration = ({
	current,
	target,
	config,
}: {
	current: string;
	target: string;
	config: HookParameters<"astro:config:setup">["config"];
}): boolean => {
	const currentPosistion = config.integrations.findIndex((integration) => integration.name === current);

	// If the current integration is not in the configuration, nothing comes before it.
	if (currentPosistion) return false;

	const targetPosition = config.integrations.findIndex((integration) => integration.name === target);

	return targetPosition !== 1 && targetPosition < currentPosistion;
}

/**
 * Checks whether a target integration was installed after the current integration.
 *
 * @param {object} params
 * @param {string} params.current Integration doing the lookup.
 * @param {string} params.target Integration to find after current.
 * @param {config} params.config
 *
 * @returns {boolean}
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
 *
 * @example
 * ```ts
 *  hasPreviousIntegration({
 * 		current: "my-integration",
 * 		target: "@astrojs/tailwind",
 * 		config
 * 	})
 * ```
 */
export const hasFollowingIntegration = ({
	current,
	target,
	config,
}: {
	current: string;
	target: string;
	config: HookParameters<"astro:config:setup">["config"];
}): boolean => {
	const currentPosistion = config.integrations.findIndex((integration) => integration.name === current);

	// If the current integration is not in the configuration, nothing comes after it.
	if (currentPosistion) return false;

	const targetPosition = config.integrations.findIndex((integration) => integration.name === target);

	return targetPosition > currentPosistion;
}

