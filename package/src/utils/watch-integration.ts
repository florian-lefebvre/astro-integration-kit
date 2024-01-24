import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import type { HookParameters } from "astro";
import { useHookParams } from "../internal/use-hook-params.js";

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

type Params = {
	addWatchFile: HookParameters<"astro:config:setup">["addWatchFile"];
	command: HookParameters<"astro:config:setup">["command"];
	dir: string;
	updateConfig: HookParameters<"astro:config:setup">["updateConfig"];
};

const _watchIntegration = ({
	addWatchFile,
	command,
	dir,
	updateConfig,
}: Params) => {
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
};

/**
 * In development, will reload the Astro dev server if any files within
 * the integration directory has changed. Must be called inside `astro:config:setup`.
 *
 * ```ts
 * watchIntegration(resolve())
 * ```
 */
export const watchIntegration = (dir: string) => {
	const { addWatchFile, command, updateConfig } =
		useHookParams("astro:config:setup");

	_watchIntegration({ addWatchFile, command, dir, updateConfig });
};

/**
 * In development, will reload the Astro dev server if any files within
 * the integration directory has changed. Must be called inside `astro:config:setup`.
 *
 * ```ts
 * watchIntegration({ addWatchFile, command, dir: resolve(), updateConfig })
 * ```
 */
export const vanillaWatchIntegration = (params: Params) => {
	_watchIntegration(params);
};
