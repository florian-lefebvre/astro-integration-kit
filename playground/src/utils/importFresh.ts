import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * Local version of { importFresh } from astro-integration-kit/dev. This function resolves the given package name and imports it with a cache-busting
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
					"/index.js",
					"/index.ts",
					"/index.mjs",
					".js",
					".ts",
					".mjs",
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

	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Date.now().toString());

	return (await import(/* @vite-ignore */ newSpecifier.href)) as T;
}
