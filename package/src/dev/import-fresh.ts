import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * This function resolves the given package name and imports it with a cache-busting
 * query parameter to ensure a fresh import that bypasses Node.js's module cache.
 * This is useful during development when you need to reload modules that may have
 * changed without restarting the process.
 *
 * @template T - The expected type of the imported module's default export or module object.
 * @param packageName - The name or path of the package/module to import
 * @returns A promise that resolves to the imported module with type T.
 *
 * @example
 * ```ts
 * import { importFresh } from "astro-integration-kit/dev";
 *
 * const { default : myIntegration } = await importFresh<typeof import("my-integration")>("my-integration");
 *
 * export default defineConfig({
 *   integrations: [myIntegration()]
 * });
 * ```
 */
export async function importFresh<T = any>(packageName: string): Promise<T> {
	const resolvedPath = require.resolve(packageName);
	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Date.now().toString());

	return (await import(/* @vite-ignore */ newSpecifier.href)) as T;
}
