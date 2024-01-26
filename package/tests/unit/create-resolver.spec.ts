import { dirname } from "pathe";
import { describe, expect, test } from "vitest";
import { createResolver } from "../../src/utils/create-resolver.js";

describe("createResolver", () => {
	const directory = dirname(import.meta.url).replace("file:///", "");

	test("Should return an object with a `resolve` method", () => {
		const resolver = createResolver(import.meta.url);

		expect(resolver.resolve).toBeDefined();
	});

	test("`resolve()` should return the `import.meta.url`", () => {
		const resolver = createResolver(import.meta.url);

		expect(resolver.resolve()).toEqual(directory);
	});

	test("`resolve('./index.astro)` should return the `{directory}/index.astro", () => {
		const fileName = "index.astro";
		const resolver = createResolver(import.meta.url);

		expect(resolver.resolve(`./${fileName}`)).toEqual(
			`${directory}/${fileName}`,
		);
	});
});
