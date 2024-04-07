import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, normalize } from "pathe";
import type { Plugin } from "vite";
import {
	type Mocked,
	afterAll,
	beforeAll,
	describe,
	expect,
	test,
	vi,
} from "vitest";
import { createResolver } from "../../src/core/create-resolver.ts";
import type { HookParameters } from "../../src/core/types.ts";
import { watchDirectory } from "../../src/utilities/watch-directory.ts";

const tempFolderName = ".TMP_WATCHDIRECTORY";

const tempPaths = [
	`${tempFolderName}/text.txt`,
	`${tempFolderName}/folderA/text.txt`,
	`${tempFolderName}/folderA/FolderB/text.txt`,
	`${tempFolderName}/folderA/FolderB/FolderC/text.txt`,
];

const { resolve } = createResolver(import.meta.url);

const createTempFiles = (paths: Array<string>) => {
	for (const path of paths) {
		const absolutePath = resolve(path);
		const directory = dirname(absolutePath);

		if (!existsSync(directory)) {
			mkdirSync(directory, {
				recursive: true,
			});
		}

		writeFileSync(absolutePath, "hello", {
			encoding: "utf-8",
		});
	}
};

const deleteTempFiles = () => {
	rmSync(resolve(tempFolderName), {
		recursive: true,
		force: true,
	});
};

const getParams = () =>
	({
		command: "dev",
		addWatchFile: vi.fn(),
		updateConfig: vi.fn(),
	}) as unknown as Mocked<HookParameters<"astro:config:setup">>;

describe("watchIntegration", () => {
	beforeAll(() => {
		createTempFiles(tempPaths);
	});

	afterAll(() => {
		deleteTempFiles();
	});

	test("Should run", () => {
		const params = getParams();

		expect(() =>
			watchDirectory(params, resolve(tempFolderName)),
		).not.toThrow();
	});

	test("Should call updateConfig", () => {
		const params = getParams();

		watchDirectory(params, resolve(tempFolderName));

		expect(params.updateConfig).toBeCalled();
	});

	test("Should call updateConfig once", () => {
		const params = getParams();

		watchDirectory(params, resolve(tempFolderName));

		expect(params.updateConfig).toBeCalledTimes(1);
	});

	test("Should call addWatchFile", () => {
		const params = getParams();

		watchDirectory(params, resolve(tempFolderName));

		expect(params.addWatchFile).toBeCalled();
	});

	test("Should call addWatchFile for each path (count)", () => {
		const params = getParams();

		watchDirectory(params, resolve(tempFolderName));

		const calls = params.addWatchFile.mock.calls.flatMap((entry) => entry[0]);

		expect(calls.length).toEqual(tempPaths.length);
	});

	test("Should call addWatchFile for each path (path check)", () => {
		const params = getParams();

		watchDirectory(params, resolve(tempFolderName));

		const calls = params.addWatchFile.mock.calls.flatMap((entry) =>
			normalize(entry[0].toString()),
		);

		const allPathsPresent = tempPaths.every((path) => {
			const resolvedPath = normalize(resolve(path));

			return calls.includes(resolvedPath);
		});

		expect(allPathsPresent).toBeTruthy();
	});

	test("Should create a vite plugin", () => {
		let plugin: Plugin;
		const params = {
			...getParams(),
			updateConfig: vi.fn((config) => {
				plugin = config.vite.plugins[0];
			}),
		} as unknown as HookParameters<"astro:config:setup">;

		watchDirectory(params, resolve(tempFolderName));

		// @ts-ignore - TS can't figure out that plugin _will_ actually be defined here
		expect(plugin).toBeDefined();
	});

	test("Should create a vite plugin (check name)", () => {
		let plugin: Plugin;
		const params = {
			...getParams(),
			updateConfig: vi.fn((config) => {
				plugin = config.vite.plugins[0];
			}),
		} as unknown as HookParameters<"astro:config:setup">;

		watchDirectory(params, resolve(tempFolderName));

		// @ts-ignore - TS can't figure out that plugin _will_ actually be defined here
		expect(plugin.name).toBeDefined();
	});
});
