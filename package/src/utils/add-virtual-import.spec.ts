import { type Mock, afterEach, describe, expect, test, vi } from "vitest";
import { mockHookParams } from "../../test/utils.js";
import { useHookParams } from "../internal/use-hook-params.js";
import { addVirtualImport } from "./add-virtual-import.js";
import {
	type Params as vanillaAddVitePluginParams,
	vanillaAddVitePlugin,
} from "./add-vite-plugin.js";

vi.mock("../internal/use-hook-params.js");
vi.mock("./add-vite-plugin.js");

describe("add-virtual-import", () => {
	const name = "test-module";
	const content = "export default {}";

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("It should use `updateConfig` from the `astro:config:setup` hook", () => {
		(vanillaAddVitePlugin as Mock).mockImplementation(
			(options: vanillaAddVitePluginParams) => {
				options.updateConfig({});
			},
		);

		const updateConfig = vi.fn();

		(useHookParams as Mock).mockReturnValue(
			mockHookParams<"astro:config:setup">({
				updateConfig,
			}),
		);

		addVirtualImport({
			name,
			content,
		});

		expect(useHookParams).toHaveBeenCalled();
	});
});
