import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * Local version of { importFresh } from astro-integration-kit/dev. This function resolves the given package name and imports it with a cache-busting
 */
export async function importFresh<T = any>(packageName: string): Promise<T> {
	const resolvedPath = require.resolve(packageName);
	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Date.now().toString());

	return (await import(/* @vite-ignore */ newSpecifier.href)) as T;
}
