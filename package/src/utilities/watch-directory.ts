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
 * the directory has changed.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {string} directory
 *
 * @see https://astro-integration-kit.netlify.app/utilities/watch-directory/
 *
 * @example
 * ```ts
 * watchDirectory(params, resolve())
 * ```
 */
export const watchDirectory = defineUtility("astro:config:setup")(
	({ addWatchFile, command, updateConfig }, directory: string) => {
		if (command !== "dev") {
			return;
		}

		const paths = getFilesRecursively(directory).map((p) =>
			resolve(directory, p),
		);

		for (const path of paths) {
			addWatchFile(path);
		}

		updateConfig({
			vite: {
				plugins: [
					{
						name: `rollup-aik-watch-directory-${directory}`,
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
