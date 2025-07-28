import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * astro-integration-kit is in a uniquely brutal situation where we can't actually use our own cache busting helper function because importing it would cache the whole module! So just for the playground of this package we have to use this "local" version of the function.
 */
export async function importFresh(packageName: string) {
	const resolvedPath = require.resolve(packageName);
	const newSpecifier = new URL(pathToFileURL(resolvedPath).href);
	newSpecifier.searchParams.set("t", Date.now().toString());

	const module = await import(/* @vite-ignore */ newSpecifier.href);
	return module.default ?? module;
}
