import type { HookParameters } from "astro";
import { AstroError } from "astro/errors";
import { afterEach, describe, expect, type Mock, test, vi } from "vitest";
import { addVirtualImports } from "../../src/utilities/add-virtual-imports.js";
import { addVitePlugin } from "../../src/utilities/add-vite-plugin.js";

vi.mock("../../src/utilities/add-vite-plugin.js");

const pluginNameStub = <T extends string>(name: T): `vite-plugin-${T}` =>
	`vite-plugin-${name}`;

const getParams = () =>
	({
		config: {},
		updateConfig: vi.fn(),
	}) as unknown as HookParameters<"astro:config:setup">;

describe("add-virtual-imports", () => {
	const name = "test-module";
	const content = "export default {}";
	const imports = { [name]: content };
	const params = getParams();
	afterEach(() => {
		vi.clearAllMocks();
	});

	test("It should call `addVitePlugin`", () => {
		addVirtualImports(params, {
			name,
			imports,
		});

		expect(addVitePlugin).toHaveBeenCalled();
	});

	test("`addVitePlugin` should get called with the correct plugin name", () => {
		addVirtualImports(params, {
			name,
			imports,
		});

		const expectedName = pluginNameStub(name);

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[1];

		expect(plugin.name).toEqual(expectedName);
	});

	test("Virtual module should resolve correct name", () => {
		addVirtualImports(params, {
			name,
			imports,
		});

		const { plugin } = (addVitePlugin as Mock).mock.lastCall[1];

		const resolvedVirtualModuleId = plugin.resolveId(name);

		expect(resolvedVirtualModuleId).toEqual(`\0${name}`);
	});

	test("It should throw an error if you try and prefix your virtual import with 'astro:'", () => {
		const testFunction = () =>
			addVirtualImports(params, {
				name,
				imports: { [`astro:${name}`]: content },
			});

		expect(testFunction).toThrowError();
	});

	test("It should throw an AstroError if you try and prefix your virtual import with 'astro:'", () => {
		const testFunction = () =>
			addVirtualImports(params, {
				name,
				imports: { [`astro:${name}`]: content },
			});

		expect(testFunction).toThrowError(AstroError);
	});
});
