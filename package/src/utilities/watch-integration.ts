import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "pathe";
import { defineUtility } from "../core/define-utility.js";

const getFilesRecursively = (dir: string, baseDir = dir) => {
	const files = readdirSync(dir);
	let filepaths: Array<string> = [];

	for (const file of files) {
		const filepath = join(dir, file);
		const _stat = statSync(filepath);

		if (_stat.isDirectory()) {
			// Recursively get files from subdirectories
			const subDirectoryFiles = getFilesRecursively(filepath, baseDir);
			filepaths = filepaths.concat(subDirectoryFiles);
		} else {
			// Calculate relative path and add it to the array
			const relativePath = relative(baseDir, filepath);
			filepaths.push(relativePath);
		}
	}

	return filepaths;
};

/**
 * In development, will reload the Astro dev server if any files within
 * the integration directory has changed.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {string} options.dir
 *
 * @see https://astro-integration-kit.netlify.app/utilities/watch-integration/
 *
 * @example
 * ```ts
 * watchIntegration(params, resolve())
 * ```
 */
export const watchIntegration = defineUtility("astro:config:setup")(
	({ addWatchFile, command, updateConfig }, dir: string) => {
		if (command !== "dev") {
			return;
		}

		const paths = getFilesRecursively(dir).map((p) => resolve(dir, p));

		for (const path of paths) {
			addWatchFile(path);
		}

		updateConfig({
			vite: {
				plugins: [
					{
						name: "rollup-plugin-astro-tailwind-config-viewer",
						buildStart() {
							for (const path of paths) {
								this.addWatchFile(path);
							}
						},
					},
				],
			},
		});
	},
);
