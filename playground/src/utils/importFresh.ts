import { statSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// We keep a local version of /package/src/dev/importFresh.ts so that we don't end up caching the package

/**
 * This function resolves the given package name and imports it with a cache-busting
 * query parameter to ensure a fresh import that bypasses Node.js's module cache.
 * This is useful during development when you need to reload modules that may have
 * changed without restarting the process.
 *
 * @template T - The expected type of the imported module's default export or module object.
 * @param packageName - The name or path of the package/module to import
 * @param callerUrl - The import.meta.url of the calling module, required for relative paths
 * @returns A promise that resolves to the imported module with type T.
 *
 * @example
 * ```ts
 * import { importFresh } from "astro-integration-kit/dev";
 *
 * // Bare specifiers work without callerUrl
 * const { default : myIntegration } = await importFresh<typeof import("my-integration")>("my-integration");
 *
 * // Relative paths require callerUrl
 * const { default : localIntegration } = await importFresh<typeof import("./integration")>("./integration", import.meta.url);
 *
 * export default defineConfig({
 *   integrations: [myIntegration(), localIntegration()]
 * });
 * ```
 */
export async function importFresh<T = any>(
	packageName: string,
	callerUrl?: string,
): Promise<T> {
	const isRelativePath =
		packageName.startsWith("./") || packageName.startsWith("../");

	if (isRelativePath && !callerUrl) {
		throw new Error(
			`importFresh: callerUrl (import.meta.url) is required when importing relative paths like "${packageName}"`,
		);
	}

	const require = createRequire(callerUrl || import.meta.url);

	const resolvedPath = (() => {
		try {
			return require.resolve(packageName);
		} catch (error) {
			// If the path doesn't resolve, try common extensions for directory/index imports
			if (isRelativePath) {
				const extensions = [
					".js",
					".mjs",
					".cjs",
					".ts",
					".mts",
					".cts",
					"/index.js",
					"/index.mjs",
					"/index.cjs",
					"/index.ts",
					"/index.mts",
					"/index.cts",
				];

				for (const ext of extensions) {
					try {
						return require.resolve(packageName + ext);
					} catch {
						// Continue to next extension
					}
				}
			}
			// Re-throw original error if no extensions work or not a relative path
			throw error;
		}
	})();

	const fileStats = statSync(resolvedPath);
	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Math.floor(fileStats.mtimeMs).toString());

	return (await import(/* @vite-ignore */ newSpecifier.href)) as T;
}
