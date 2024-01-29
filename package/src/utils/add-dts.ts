import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";

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
			`/// <reference types='astro/client' />\n/// <reference types='${specifier}' />`,
		)
		.replace(
			`/// <reference types="astro/client" />`,
			`/// <reference types="astro/client" />\n/// <reference types="${specifier}" />`,
		);

	// the odd case where the user changed the reference to astro/client
	if (newEnvDTsContents === envDTsContents) {
		return;
	}

	await writeFile(envDTsPath, newEnvDTsContents);
	logger.info("Updated env.d.ts types");
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
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-dts/
 */
export const addDts = async ({
	name,
	content,
	root,
	srcDir,
	logger,
}: {
	name: string;
	content: string;
	root: URL;
	srcDir: URL;
	logger: AstroIntegrationLogger;
}) => {
	const dtsURL = new URL(`.astro/${name}.d.ts`, root);
	const filePath = fileURLToPath(dtsURL);

	await injectEnvDTS({
		srcDir,
		logger,
		specifier: dtsURL,
	});

	await mkdir(dirname(filePath), { recursive: true });
	await writeFile(filePath, content, "utf-8");
};
