import type { HookParameters } from "astro";
import type { Plugin } from "vite";
import { describe, expect, test, vi } from "vitest";
import { addVitePlugin } from "../../src/utilities/add-vite-plugin.js";

describe("addVitePlugin", () => {
	test("Should run", () => {
		const updateConfig = vi.fn();

		expect(() =>
			addVitePlugin({
				plugin: null,
				updateConfig,
			}),
		).not.toThrow();
	});

	test("Should call updateConfig", () => {
		const updateConfig = vi.fn();

		addVitePlugin({
			plugin: null,
			updateConfig,
		});

		expect(updateConfig).toHaveBeenCalled();
	});

	test("Should add vite plugin", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({
			plugin: expectedPlugin,
			updateConfig,
		});

		// @ts-ignore
		expect(plugin).toBeDefined();
	});

	test("Plugin name should match", () => {
		let plugin: Plugin;
		const pluginName = "test-plugin";

		const updateConfig = vi.fn((config) => {
			plugin = config.vite.plugins[0];
		}) as unknown as HookParameters<"astro:config:setup">["updateConfig"];

		const expectedPlugin = {
			name: pluginName,
		};

		addVitePlugin({
			plugin: expectedPlugin,
			updateConfig,
		});

		// @ts-ignore
		expect(plugin.name).toBe(pluginName);
	});
});
