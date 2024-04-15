import { beforeEach, describe, expect, it } from "vitest";
import { createResolver } from "../../../src/core/create-resolver.js";

const createFixture = () => {
	let path: string;
	let resolvedPath: string;

	return {
		givenPath(_path: string) {
			path = _path;
		},
		givenPathToResolve(..._path: string[]) {
			resolvedPath = createResolver(path).resolve(..._path);
		},
		thenResolvedPathShouldBe(expected: string) {
			expect(resolvedPath).toEqual(expected);
		},
	};
};

describe("core: createResolver", () => {
	let fixture: ReturnType<typeof createFixture>;

	beforeEach(() => {
		fixture = createFixture();
	});

	it("Should strip the `file:///` prefix", () => {
		const inputPath = "file:///C:/folder/file.ts";

		fixture.givenPath(inputPath);
		fixture.givenPathToResolve();

		fixture.thenResolvedPathShouldBe("C:/folder");
	});

	it("Should resolve the dirname when no path to resovle is specified", () => {
		const inputPath = "file:///C:/a/b/c/file.ts";

		fixture.givenPath(inputPath);
		fixture.givenPathToResolve();

		fixture.thenResolvedPathShouldBe("C:/a/b/c");
	});

	it("Should resolve relative paths", () => {
		const inputPath = "file:///C:/a/b/c/file.ts";

		fixture.givenPath(inputPath);
		fixture.givenPathToResolve("../assets/test.json");

		fixture.thenResolvedPathShouldBe("C:/a/b/assets/test.json");
	});
});
