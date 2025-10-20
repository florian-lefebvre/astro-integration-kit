import { describe, expect, test } from "vitest";
import { hasVitePlugin } from "../../src/utilities/has-vite-plugin.js";

describe("hasVitePlugin", () => {
	const name = "vite-plugin-my-integration";
	const plugin = { name };

	test("Should not detect a plugin", () => {
		expect(
			hasVitePlugin({ config: {} } as any, {
				plugin: null,
			}),
		).toBe(false);
	});

	test("Should detect a plugin using a string", () => {
		expect(
			hasVitePlugin(
				{
					config: {
						vite: {
							plugins: [plugin],
						},
					},
				} as any,
				{
					plugin: name,
				},
			),
		).toBe(true);
	});

	test("Should detect a plugin using a plugin", () => {
		expect(
			hasVitePlugin(
				{
					config: {
						vite: {
							plugins: [plugin],
						},
					},
				} as any,
				{
					plugin,
				},
			),
		).toBe(true);
	});

	test("Should detect a plugin using a nested plugin", () => {
		expect(
			hasVitePlugin(
				{
					config: {
						vite: {
							plugins: [plugin],
						},
					},
				} as any,
				{
					plugin: [[[plugin]]],
				},
			),
		).toBe(true);
	});

	test("Should detect a nested plugin", () => {
		expect(
			hasVitePlugin(
				{
					config: {
						vite: {
							plugins: [[[plugin]]],
						},
					},
				} as any,
				{
					plugin,
				},
			),
		).toBe(true);
	});
});
