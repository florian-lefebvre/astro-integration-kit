import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Allows resolving paths relatively to the integration folder easily. Call it like this:
 *
 * ```ts
 * const { resolve } = createResolver(import.meta.url);
 * const pluginPath = resolve("./plugin.ts");
 * ```
 *
 * This way, you do not have to add your plugin to your package.json `exports`.
 */
export const createResolver = (_base: string) => {
	let base = _base;
	if (base.startsWith("file://")) {
		base = dirname(fileURLToPath(base));
	}

	return {
		resolve: (...path: Array<string>) => resolve(base, ...path),
	};
};
