import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * Imports a package with cache busting to ensure fresh imports during development.
 *
 * This is needed for Astro 5+ where bare specifiers are loaded through Node.js
 * instead of Vite, which means they don't get refreshed when the dev server restarts
 * since they're in the same Node.js process.
 *
 * @param packageName - The package name to import (e.g., "my-integration")
 * @returns The imported module (default export or entire module)
 *
 * @example
 * ```ts
 * // In astro.config.mjs
 * import { importFresh } from "astro-integration-kit/dev";
 *
 * const myIntegration = await importFresh("my-integration");
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

  const module = await import(/* @vite-ignore */ newSpecifier.href);
  return (module.default ?? module) as T;
}
