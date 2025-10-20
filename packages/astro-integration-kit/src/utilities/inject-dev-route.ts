import type { InjectedRoute } from "astro";
import { defineUtility } from "../core/define-utility.js";

/**
 * Allows you to inject a route in development only
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {import("astro").InjectedRoute} options.injectedRoute
 *
 * @example
 * ```ts
 * injectDevRoute(params, {
 * 		pattern: "/foo",
 * 		entrypoint: resolve("./pages/foo.astro")
 * })
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/inject-dev-route/
 */
export const injectDevRoute = defineUtility("astro:config:setup")(
	({ command, injectRoute }, injectedRoute: InjectedRoute) => {
		if (command === "dev") {
			injectRoute(injectedRoute);
		}
	},
);
