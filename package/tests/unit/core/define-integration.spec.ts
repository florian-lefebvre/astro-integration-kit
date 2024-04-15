import { describe, expect, beforeEach, it } from "vitest";
import { defineIntegration } from "../../../src/core/define-integration.js";
import type { AstroIntegration } from "astro";
import { z } from "astro/zod";

type DefineIntegrationParams = Parameters<typeof defineIntegration>[0];

const createFixture = () => {
	let name = "my-integration";
	let setup: DefineIntegrationParams["setup"] = () => ({
		hooks: {},
	});
	let optionsSchema: DefineIntegrationParams["optionsSchema"];

	return {
		givenName(_name: string) {
			name = _name;
		},
		givenSetup(_setup: typeof setup) {
			setup = _setup;
		},
		givenOptionsSchema(_optionsSchema: typeof optionsSchema) {
			optionsSchema = _optionsSchema;
		},
		thenIntegrationShouldBe(expected: AstroIntegration) {
			const resolved = defineIntegration({
				name,
				optionsSchema,
				setup,
			})();
			expect(resolved.name).toEqual(expected.name);
			expect(Object.keys(resolved.hooks).sort()).toEqual(
				Object.keys(expected.hooks).sort(),
			);
		},
		thenExtraFieldShouldBe(key: string, value: any) {
			const resolved = defineIntegration({
				name,
				optionsSchema,
				setup,
			})();
			expect(Object.keys(resolved).includes(key)).toEqual(true);
			// @ts-ignore
			expect(resolved[key]).toEqual(value);
		},
		thenIntegrationCreationShouldNotThrow(options: any) {
			expect(() =>
				defineIntegration({
					name,
					optionsSchema,
					setup,
				})(options),
			).not.toThrow();
		},
		thenIntegrationCreationShouldThrow(options: any) {
			expect(() =>
				defineIntegration({
					name,
					optionsSchema,
					setup,
				})(options),
			).toThrow();
		},
	};
};

describe("core: defineIntegration", () => {
	let fixture: ReturnType<typeof createFixture>;

	beforeEach(() => {
		fixture = createFixture();
	});

	it("Should return the correct integration with no hooks", () => {
		const name = "my-integration";
		const setup = () => ({ hooks: {} });

		fixture.givenName(name);
		fixture.givenSetup(setup);

		fixture.thenIntegrationShouldBe({
			name: "my-integration",
			hooks: {},
		});
	});

	it("Should return the correct integration with some hooks", () => {
		const name = "my-integration";
		const setup = () => ({
			hooks: {
				"astro:config:setup": () => {},
				"astro:server:start": () => {},
			},
		});

		fixture.givenName(name);
		fixture.givenSetup(setup);

		fixture.thenIntegrationShouldBe({
			name: "my-integration",
			hooks: {
				"astro:server:start": () => {},
				"astro:config:setup": () => {},
			},
		});
	});

	it("Should handle optionsSchema correctly", () => {
		const optionsSchema = z.object({
			foo: z.string(),
		});

		fixture.givenOptionsSchema(optionsSchema);
		fixture.thenIntegrationCreationShouldNotThrow({
			foo: "bar",
		});
		fixture.thenIntegrationCreationShouldThrow(null);
		fixture.thenIntegrationCreationShouldThrow({
			foo: 123,
		});
	});

	it("Should accept any extra field from setup", () => {
		const setup = () => ({
			hooks: {},
			config: {
				foo: "bar",
			},
		});

		fixture.givenSetup(setup);
		fixture.thenExtraFieldShouldBe("config", { foo: "bar" });
	});
});
