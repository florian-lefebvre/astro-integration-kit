import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import type { HookParameters } from "astro";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createResolver } from "../../src/core/create-resolver.js";
import { addDts } from "../../src/utilities/add-dts.js";

const tempFolderName = ".TMP_ADDDTS/";
const { resolve } = createResolver(import.meta.url);
const { resolve: tempFolderResolver } = createResolver(resolve(tempFolderName));
const envDtsPath = resolve(`${tempFolderName}/env.d.ts`);

const createTempFiles = () => {
	mkdirSync(resolve(tempFolderName));

	writeFileSync(envDtsPath, `/// <reference types="astro/client" />`, {
		encoding: "utf-8",
	});
};

const deleteTempFiles = () => {
	rmSync(resolve(tempFolderName), {
		recursive: true,
		force: true,
	});
};

const getParams = () =>
	({
		config: {
			root: new URL(tempFolderName, import.meta.url),
			srcDir: new URL(tempFolderName, import.meta.url),
		},
		logger: {
			info: vi.fn(),
		},
	}) as unknown as HookParameters<"astro:config:setup">;

describe("addDts", () => {
	beforeAll(() => {
		createTempFiles();
	});

	afterAll(() => {
		deleteTempFiles();
	});

	test("Should run", () => {
		const dtsFileName = "TEST";
		const dtsFileContent = 'declare module "my-integration" {}';
		const params = getParams();

		expect(() =>
			addDts(params, {
				name: dtsFileName,
				content: dtsFileContent,
			}),
		).not.toThrow();
	});

	test("Should update the env.d.ts (double quotes)", () => {
		const dtsFileName = "TEST";
		const dtsFileContent = 'declare module "my-integration" {}';
		const params = getParams();

		const expectedEnvDtsContent = `/// <reference types="astro/client" />\n/// <reference types=".astro/${dtsFileName}.d.ts" />`;

		addDts(params, {
			name: dtsFileName,
			content: dtsFileContent,
		});

		const fileContents = readFileSync(envDtsPath, {
			encoding: "utf-8",
		});

		expect(fileContents).toEqual(expectedEnvDtsContent);
	});

	test("Should update the env.d.ts (single quotes)", () => {
		const dtsFileName = "TEST";
		const dtsFileContent = 'declare module "my-integration" {}';
		const params = getParams();

		const expectedEnvDtsContent = `/// <reference types='astro/client' />\n/// <reference types='.astro/${dtsFileName}.d.ts' />`;

		writeFileSync(envDtsPath, `/// <reference types='astro/client' />`, {
			encoding: "utf-8",
		});

		addDts(params, {
			name: dtsFileName,
			content: dtsFileContent,
		});

		const fileContents = readFileSync(envDtsPath, {
			encoding: "utf-8",
		});

		expect(fileContents).toEqual(expectedEnvDtsContent);
	});

	test("Should create the virtual file", () => {
		const dtsFileName = "TEST";
		const dtsFileContent = 'declare module "my-integration" {}';
		const params = getParams();

		addDts(params, {
			name: dtsFileName,
			content: dtsFileContent,
		});

		const fileContents = readFileSync(
			tempFolderResolver(`.astro/${dtsFileName}.d.ts`),
			{
				encoding: "utf-8",
			},
		);

		expect(fileContents).toEqual(dtsFileContent);
	});
});
