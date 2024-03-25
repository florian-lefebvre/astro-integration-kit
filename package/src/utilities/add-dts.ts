import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegrationLogger } from "astro";
import { parse, prettyPrint } from "recast";
import typescriptParser from "recast/parsers/typescript.js";
import { defineUtility } from "../core/define-utility.js";

const injectEnvDTS = ({
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

	const envDTsContents = readFileSync(envDTsPath, "utf8");

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

	writeFileSync(envDTsPath, newEnvDTsContents);
	logger.info("Updated env.d.ts types");
};

/**
 * Allows to inject .d.ts file in users project. It will create a file inside `.astro`
 * and reference it from `src/env.d.ts`.
 *
 * @param {import("astro").HookParameters<"astro:config:setup">} params
 * @param {object} options
 * @param {string} options.name - The name of the .d.ts file. Eg `test` will generate `.astro/test.d.ts`
 * @param {string} options.content
 *
 * @example
 * ```ts
 * addDts(params, {
 * 		name: "my-integration",
 * 	 	content: `declare module "virtual:my-integration" {}`,
 * })
 * ```
 *
 * @see https://astro-integration-kit.netlify.app/utilities/add-dts/
 */
export const addDts = defineUtility("astro:config:setup")(
	(
		{ config: { root, srcDir }, logger },
		{
			name,
			content,
		}: {
			name: string;
			content: string;
		},
	) => {
		const dtsURL = new URL(`.astro/${name}.d.ts`, root);
		const filePath = fileURLToPath(dtsURL);

		injectEnvDTS({
			srcDir,
			logger,
			specifier: dtsURL,
		});

		mkdirSync(dirname(filePath), { recursive: true });
		writeFileSync(
			filePath,
			prettyPrint(
				parse(content, {
					parser: typescriptParser,
				}),
				{ tabWidth: 4 },
			).code,
			"utf-8",
		);
	},
);
