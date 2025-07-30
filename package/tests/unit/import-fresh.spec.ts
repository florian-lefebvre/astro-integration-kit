import { describe, expect, it } from "vitest";
import { importFresh } from "../../src/dev/import-fresh.js";

describe("importFresh", () => {
	it("should try extensions for relative paths when callerUrl is provided", async () => {
		// This should try extensions but ultimately fail with MODULE_NOT_FOUND (not callerUrl error)
		// We're testing that it gets past the callerUrl requirement and tries the extensions
		await expect(
			importFresh("./non-existent-directory", import.meta.url),
		).rejects.toThrow();
		// Should not throw the callerUrl error anymore since we provided it
		await expect(
			importFresh("./non-existent-directory", import.meta.url),
		).rejects.not.toThrow(
			"importFresh: callerUrl (import.meta.url) is required",
		);
	});

	it("should require callerUrl for relative paths", async () => {
		// This should throw an error since it's a relative path without callerUrl
		await expect(importFresh("./some-relative-path")).rejects.toThrow(
			'importFresh: callerUrl (import.meta.url) is required when importing relative paths like "./some-relative-path"',
		);
	});

	it("should require callerUrl for parent relative paths", async () => {
		// This should also throw an error
		await expect(importFresh("../some-parent-path")).rejects.toThrow(
			'importFresh: callerUrl (import.meta.url) is required when importing relative paths like "../some-parent-path"',
		);
	});

	it("should resolve directory to index.ts when available", async () => {
		// Should resolve ./test-directory to ./test-directory/index.ts
		const result = await importFresh(
			"../fixtures/importfresh/test-directory",
			import.meta.url,
		);
		expect(result).toBeDefined();
		expect(result.default.type).toBe("index.ts");
		expect(result.testValue).toBe("found-index-ts");
	});

	it("should resolve directory to index.mjs when available", async () => {
		// Should resolve ./mjs-directory to ./mjs-directory/index.mjs
		const result = await importFresh(
			"../fixtures/importfresh/mjs-directory",
			import.meta.url,
		);
		expect(result).toBeDefined();
		expect(result.default.type).toBe("index.mjs");
		expect(result.testValue).toBe("found-index-mjs");
	});

	it("should resolve file with .mjs extension", async () => {
		// Should resolve ./test-file to ./test-file.mjs
		const result = await importFresh(
			"../fixtures/importfresh/test-file",
			import.meta.url,
		);
		expect(result).toBeDefined();
		expect(result.default.type).toBe("mjs-file");
		expect(result.testValue).toBe("found-mjs-file");
	});
});
