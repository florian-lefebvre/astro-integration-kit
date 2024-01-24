import type { HookParameters } from "astro";
import { useHookParams } from "../internal/use-hook-params.js";

type Params = {
	name: string;
	config: HookParameters<"astro:config:setup">["config"];
};

const _hasIntegration = ({ name, config }: Params) => {
	return !!config.integrations.find((integration) => integration.name === name);
};

/**
 * Checks whether an integration is already installed.
 *
 * @param {string} name
 *
 * @returns {boolean}
 *
 * @see https://astro-integration-kit.netlify.app/utilities/has-integration/
 *
 * @example
 * ```ts
 *  hasIntegration("@astrojs/tailwind")
 * ```
 */
export const hasIntegration = (name: Params["name"]): boolean => {
	const { config } = useHookParams("astro:config:setup");

	return _hasIntegration({ name, config });
};

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
 *  vanillaHasIntegration("@astrojs/tailwind")
 * ```
 */
export const vanillaHasIntegration = (params: Params): boolean => {
	return _hasIntegration(params);
};
