import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * We need a "local" version of this because importing it would cache astro-integration-kit 😵‍💫
 */
export async function importFresh<T = any>(packageName: string): Promise<T> {
	const resolvedPath = require.resolve(packageName);
	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Date.now().toString());

	return (await import(/* @vite-ignore */ newSpecifier.href)) as T;
}
