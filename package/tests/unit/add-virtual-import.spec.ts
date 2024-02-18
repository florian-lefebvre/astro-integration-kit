import { AstroError } from "astro/errors";
import { type Mock, afterEach, describe, expect, test, vi } from "vitest";
import { addVirtualImport } from "../../src/utilities/add-virtual-import.js";
import { addVitePlugin } from "../../src/utilities/add-vite-plugin.js";

vi.mock("../../src/utilities/add-vite-plugin.js");

const pluginNameStub = <T extends string>(name: T): `vite-plugin-${T}` =>
	`vite-plugin-${name}`;

describe("add-virtual-import", () => {
	const name = "test-module";
	const content = "export default {}";
	const updateConfig = vi.fn();

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("It should call `addVitePlugin`", () => {
		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		expect(addVitePlugin).toHaveBeenCalled();
	});

	test("`addVitePlugin` should get called with the correct plugin name", () => {
		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		const expectedName = pluginNameStub(name);

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0];

		expect(plugin.name).toEqual(expectedName);
	});

	test("Virtual module should resolve correct name", () => {
		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0];

		const resolvedVirtualModuleId = plugin.resolveId(name);

		expect(resolvedVirtualModuleId).toEqual(`\0${name}`);
	});

	test("It should throw an error if you try and prefix your virtual import with 'astro:'", () => {
		const testFunction = () =>
			addVirtualImport({
				name: `astro:${name}`,
				content,
				updateConfig,
			});

		expect(testFunction).toThrowError();
	});

	test("It should throw an AstroError if you try and prefix your virtual import with 'astro:'", () => {
		const testFunction = () =>
			addVirtualImport({
				name: `astro:${name}`,
				content,
				updateConfig,
			});

		expect(testFunction).toThrowError(AstroError);
	});
});
