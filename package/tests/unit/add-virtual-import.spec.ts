import { afterEach, type Mock, describe, expect, test, vi } from "vitest";
import { addVirtualImport } from "../../src/utils/add-virtual-import.js";
import { addVitePlugin } from "../../src/utils/add-vite-plugin.js";

vi.mock('../../src/utils/add-vite-plugin.js')

const pluginNameStub = <T extends string>(name: T): `vite-plugin-${T}` => `vite-plugin-${name}`

describe("add-virtual-import", () => {
	const name = "test-module";
	const content = "export default {}";

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("It should call `addVitePlugin`", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		expect(addVitePlugin).toHaveBeenCalled();
	});

	test("`addVitePlugin` should get called with the correct plugin name", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});

		const expectedName = pluginNameStub(name)
		
		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0]

		expect(plugin.name).toEqual(expectedName);
	});

	test("Virtual module should resolve correct name", () => {
		const updateConfig = vi.fn();

		addVirtualImport({
			name,
			content,
			updateConfig,
		});
		
		const { plugin } = (addVitePlugin as Mock).mock.lastCall[0]

		const resolvedVirtualModuleId = plugin.resolveId(name)

		expect(resolvedVirtualModuleId).toEqual(`\0${ name }`);
	});
});
