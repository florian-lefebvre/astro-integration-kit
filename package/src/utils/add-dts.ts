import { readFile, writeFile } from "node:fs/promises";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";
import { useHookParams } from "../internal.js";
import { ensureDirExists } from "../internal/node.js";

const injectEnvDTS = async ({
	srcDir,
	logger,
	specifier,
}: {
	srcDir: URL;
	logger: AstroIntegrationLogger;
	specifier: URL | string;
}) => {
	const envDTsPath = fileURLToPath(new URL("env.d.ts", srcDir));

	if (specifier instanceof URL) {
		specifier = fileURLToPath(specifier);
		specifier = relative(fileURLToPath(srcDir), specifier);
		specifier = specifier.replaceAll("\\", "/");
	}

	const envDTsContents = await readFile(envDTsPath, "utf8");

	if (envDTsContents.includes(`/// <reference types='${specifier}' />`)) {
		return;
	}
	if (envDTsContents.includes(`/// <reference types="${specifier}" />`)) {
		return;
	}

	const newEnvDTsContents = envDTsContents
		.replace(
			`/// <reference types='astro/client' />`,
			`/// <reference types='astro/client' />\n/// <reference types='${specifier}' />\n`,
		)
		.replace(
			`/// <reference types="astro/client" />`,
			`/// <reference types="astro/client" />\n/// <reference types="${specifier}" />\n`,
		);

	// the odd case where the user changed the reference to astro/client
	if (newEnvDTsContents === envDTsContents) {
		return;
	}

	await writeFile(envDTsPath, newEnvDTsContents);
	logger.info("Updated env.d.ts types");
};

type Params = {
	name: string;
	content: string;
	root: URL;
	srcDir: URL;
	logger: AstroIntegrationLogger;
};

export const _addDts = async ({
	name,
	content,
	root,
	srcDir,
	logger,
}: Params) => {
	const dtsURL = new URL(`.astro/${name}.d.ts`, root);
	const filePath = fileURLToPath(dtsURL);

	await injectEnvDTS({
		srcDir,
		logger,
		specifier: dtsURL,
	});

	await ensureDirExists(filePath);
	await writeFile(filePath, content, "utf-8");
};

/**
 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
 * and reference it from `src/env.d.ts`.
 *
 * @param {object} params
 * @param {string} params.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
 * @param {string} params.content
 *
 * @example
 * ```ts
 * addDts({
 * 	 name: "my-integration",
 * 	 content: `declare module "virtual:my-integration" {}`
 * })
 * ```
 */
export const addDts = async ({
	name,
	content,
}: Pick<Params, "name" | "content">) => {
	const { config, logger } = useHookParams("astro:config:setup");

	await _addDts({
		name,
		content,
		root: config.root,
		srcDir: config.srcDir,
		logger,
	});
};

/**
 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
 * and reference it from `src/env.d.ts`.
 *
 * @param {object} params
 * @param {string} params.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
 * @param {string} params.content
 * @param {URL} params.root
 * @param {URL} params.srcDir
 * @param {import("astro").AstroIntegrationLogger} params.logger
 *
 * @example
 * ```ts
 * addDts({
 * 	 name: "my-integration",
 * 	 content: `declare module "virtual:my-integration" {}`,
 * 	 root,
 * 	 srcDir,
 * 	 logger
 * })
 * ```
 */
export const vanillaAddDts = async (params: Params) => {
	_addDts(params);
};
