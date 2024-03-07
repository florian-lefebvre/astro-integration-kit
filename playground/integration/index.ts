import { readFileSync } from "node:fs";
import { createResolver, defineIntegration } from "astro-integration-kit";
import { corePlugins } from "astro-integration-kit/plugins";
import { z } from "astro/zod";

import Preact from "@astrojs/preact";
import React from "@astrojs/react";
import Solid from "@astrojs/solid-js";
import Svelte from "@astrojs/svelte";
import Vue from "@astrojs/vue";

const optionsSchema = z
	.object({
		/**
		 * The name of the resource.
		 */
		resource: z
			.string()
			.default("abc")
			.transform((val) => val.length),
	})
	.refine((val) => val.resource > 1, {
		message: "Must be at least 2 chars long",
		path: ["resource"],
	});

const testIntegration = defineIntegration({
	name: "test-integration",
	optionsSchema,
	plugins: [...corePlugins],
	setup: ({ options }) => {
		const { resolve } = createResolver(import.meta.url);
		options.resource;

		const pluginPath = resolve("./plugin.ts");
		console.log({ options, pluginPath });

		return {
			"astro:config:setup": ({
				config,
				updateConfig,
				watchIntegration,
				hasVitePlugin,
				hasIntegration,
				addDts,
				addDevToolbarFrameworkApp,
				addIntegration,
				addVirtualImports,
				addVitePlugin,
			}) => {
				watchIntegration(resolve());

				addDts({
					name: "test-integration",
					content: readFileSync(resolve("./virtual.d.ts"), "utf-8"),
				});

				addDts({
					name: "test-format",
					content: `declare module "test:whatever" {
						interface A {
									foo: bar;
							}
				export const a: A;
					}`,
				});

				console.log(
					"Test hasViteplugin: ",
					hasVitePlugin("vite-plugin-test-integration"),
				);

				addVirtualImports({
					"virtual:astro-integration-kit-playground/config": `export default ${JSON.stringify(
						{ foo: "bar" },
					)}`,
				});

				console.log(
					"Test hasViteplugin: ",
					hasVitePlugin("vite-plugin-test-integration"),
					hasVitePlugin({ name: "vite-plugin-test-integration" }),
					hasVitePlugin([{ name: "vite-plugin-test-integration" }]),
					hasVitePlugin([[{ name: "vite-plugin-test-integration" }]]),
				);

				// This is for testing incrementing plugin names, toggle `warnDuplicate` option in `addVitePlugin` util file to `false` to test this
				// addVitePlugin({ name: "vite-plugin-test-integration" });
				// addVitePlugin({ name: "vite-plugin-test-integration" });
				// addVitePlugin({ name: "vite-plugin-test-integration-0" });
				// addVitePlugin({ name: "vite-plugin-test-integration-0" });
				// addVitePlugin({ name: "vite-plugin-test-integration-1" });
				// addVitePlugin({ name: "vite-plugin-test-integration-1" });
				// addVitePlugin({ name: "vite-plugin-test-integration-1" });
				// addVitePlugin({ name: "vite-plugin-test-integration-10" });

				if (hasIntegration("@astrojs/tailwind")) {
					console.log("Tailwind is installed");
				}

				if (hasIntegration("@astrojs/tailwind", "before")) {
					console.log("Tailwind is installed before this");
				}

				if (hasIntegration("integration-a", "after")) {
					console.log("Integration A is installed after this");
				}

				if (hasIntegration("integration-a", "before", "integration-b")) {
					console.log("Integration A is installed before Integration B");
				}

				if (hasIntegration("integration-b", "after", "integration-a")) {
					console.log("Integration B is installed after Integration A");
				}

				updateConfig({
					vite: {
						optimizeDeps: {
							exclude: ["virtual:@astrojs/vue/app"],
						},
					},
				});

				addIntegration(
					React({
						include: ["**/*.react.jsx"],
					}),
				);
				addIntegration(
					Preact({
						include: ["**/*.preact.jsx"],
					}),
				);
				addIntegration(Svelte());

				addIntegration(
					Solid({
						include: ["**/*.solid.jsx"],
					}),
				);

				addDevToolbarFrameworkApp({
					framework: "react",
					name: "Test React Plugin",
					id: "test-react-plugin",
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348"><title>React Logo</title><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
					src: resolve("./devToolbarApps/Test.react.jsx"),
				});

				console.log(
					"Test duplicate hasVitePlugin inside current integration (Warning should be below this message)",
				);
				addDevToolbarFrameworkApp({
					framework: "react",
					name: "Test React Plugin",
					id: "test-react-plugin",
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348"><title>React Logo</title><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
					src: resolve("./devToolbarApps/Test.react.jsx"),
				});

				addDevToolbarFrameworkApp({
					framework: "preact",
					name: "Test Preact Plugin",
					id: "test-preact-plugin",
					icon: `<svg xmlns="http://www.w3.org/2000/svg" width="0.87em" height="1em" viewBox="0 0 256 296"><path fill="#673AB8" d="m128 0l128 73.9v147.8l-128 73.9L0 221.7V73.9z"/><path fill="#FFF" d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704c51.055-39.888 80.24-88.345 63.224-110.126c-17.017-21.78-71.095-5.184-122.15 34.704c-51.055 39.89-80.24 88.346-63.224 110.126m7.27-5.68c-5.644-7.222-3.178-21.402 7.573-39.253c11.322-18.797 30.541-39.548 54.06-57.923c23.52-18.375 48.303-32.004 69.281-38.442c19.922-6.113 34.277-5.075 39.92 2.148c5.644 7.223 3.178 21.403-7.573 39.254c-11.322 18.797-30.541 39.547-54.06 57.923c-23.52 18.375-48.304 32.004-69.281 38.441c-19.922 6.114-34.277 5.076-39.92-2.147"/><path fill="#FFF" d="M220.239 220.478c17.017-21.78-12.169-70.237-63.224-110.126C105.96 70.464 51.88 53.868 34.865 75.648c-17.017 21.78 12.169 70.238 63.224 110.126c51.055 39.889 105.133 56.485 122.15 34.704m-7.27-5.68c-5.643 7.224-19.998 8.262-39.92 2.148c-20.978-6.437-45.761-20.066-69.28-38.441c-23.52-18.376-42.74-39.126-54.06-57.923c-10.752-17.851-13.218-32.03-7.575-39.254c5.644-7.223 19.999-8.261 39.92-2.148c20.978 6.438 45.762 20.067 69.281 38.442c23.52 18.375 42.739 39.126 54.06 57.923c10.752 17.85 13.218 32.03 7.574 39.254"/><path fill="#FFF" d="M127.552 167.667c10.827 0 19.603-8.777 19.603-19.604c0-10.826-8.776-19.603-19.603-19.603c-10.827 0-19.604 8.777-19.604 19.603c0 10.827 8.777 19.604 19.604 19.604"/></svg>`,
					src: resolve("./devToolbarApps/Test.preact.jsx"),
				});

				addDevToolbarFrameworkApp({
					framework: "svelte",
					name: "Test Svelte Plugin",
					id: "test-svelte-plugin",
					icon: `
					<?xml version="1.0" encoding="UTF-8"?>
					<!-- License: null. Made by gilbarbara: https://github.com/gilbarbara/logos -->
					<svg width="308px" height="308px" viewBox="-26 0 308 308" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
						<g>
									<path d="M239.681566,40.706757 C211.113272,-0.181889366 154.69089,-12.301439 113.894816,13.6910393 L42.2469062,59.3555354 C22.6760042,71.6680028 9.1958152,91.6538543 5.11196889,114.412133 C1.69420521,133.371174 4.6982178,152.928576 13.6483951,169.987905 C7.51549676,179.291145 3.33259428,189.7413 1.3524912,200.706787 C-2.77083771,223.902098 2.62286977,247.780539 16.3159596,266.951444 C44.8902975,307.843936 101.312954,319.958266 142.10271,293.967161 L213.75062,248.302665 C233.322905,235.991626 246.803553,216.005094 250.885557,193.246067 C254.302867,174.287249 251.30121,154.730228 242.355449,137.668922 C248.486748,128.365895 252.667894,117.916162 254.646134,106.951413 C258.772188,83.7560394 253.378243,59.8765465 239.682665,40.706757" fill="#FF3E00"></path>
									<path d="M106.888658,270.841265 C83.7871855,276.848065 59.3915045,267.805346 45.7864111,248.192566 C37.5477583,236.66102 34.3023491,222.296573 36.7830958,208.343155 C37.1989333,206.075414 37.7711933,203.839165 38.4957755,201.650433 L39.845476,197.534835 L43.5173097,200.231763 C51.9971301,206.462491 61.4784803,211.199728 71.5527203,214.239302 L74.2164003,215.047419 L73.9710252,217.705878 C73.6455499,221.487851 74.6696022,225.262925 76.8616703,228.361972 C80.9560313,234.269749 88.3011363,236.995968 95.2584831,235.190159 C96.8160691,234.773852 98.3006859,234.121384 99.6606718,233.25546 L171.331634,187.582718 C174.877468,185.349963 177.321139,181.729229 178.065299,177.605596 C178.808171,173.400048 177.830501,169.072361 175.351884,165.594581 C171.255076,159.685578 163.908134,156.9582 156.947927,158.762547 C155.392392,159.178888 153.90975,159.83088 152.551509,160.695872 L125.202489,178.130144 C120.705281,180.989558 115.797437,183.144784 110.64897,184.521162 C87.547692,190.527609 63.1523949,181.484801 49.5475471,161.872188 C41.3085624,150.340895 38.0631179,135.976391 40.5442317,122.023052 C43.0002744,108.333716 51.1099574,96.3125326 62.8835328,88.9089537 L134.548175,43.2323647 C139.047294,40.3682559 143.958644,38.21032 149.111311,36.8336525 C172.21244,30.8273594 196.607527,39.8700206 210.212459,59.4823515 C218.451112,71.013898 221.696522,85.3783452 219.215775,99.3317627 C218.798144,101.59911 218.225915,103.835236 217.503095,106.024485 L216.153395,110.140083 L212.483484,107.447276 C204.004261,101.212984 194.522,96.4735732 184.44615,93.4336926 L181.78247,92.6253012 L182.027845,89.9668419 C182.350522,86.1852063 181.326723,82.4111645 179.1372,79.3110228 C175.042839,73.4032457 167.697734,70.677026 160.740387,72.4828355 C159.182801,72.8991426 157.698185,73.5516104 156.338199,74.4175344 L84.6672364,120.0922 C81.1218886,122.323199 78.6795938,125.943704 77.9387928,130.066574 C77.1913232,134.271925 78.1673502,138.601163 80.6469865,142.078963 C84.7438467,147.987899 92.0907405,150.71526 99.0509435,148.910997 C100.608143,148.493836 102.092543,147.841423 103.452857,146.976298 L130.798305,129.548621 C135.293566,126.685437 140.201191,124.528302 145.350175,123.152382 C168.451453,117.145935 192.846751,126.188743 206.451598,145.801356 C214.690583,157.332649 217.936027,171.697153 215.454914,185.650492 C212.997261,199.340539 204.888162,211.362752 193.115613,218.769811 L121.450695,264.442553 C116.951576,267.306662 112.040226,269.464598 106.887559,270.841265" fill="#FFFFFF"></path>
							</g>
					</svg>`,
					style: `
						p {
							padding: 2rem;
							background: red;
						}
					`,
					src: resolve("./devToolbarApps/Test.svelte"),
				});

				addDevToolbarFrameworkApp({
					framework: "solid",
					name: "Test Solid Plugin",
					id: "test-solid-plugin",
					icon: `
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70.23" height="70.7" viewBox="0 0 70.23 70.7">
						<defs>
						<style>
							.a {
							fill: #76b3e1;
							}

							.b, .d {
							isolation: isolate;
							opacity: 0.3;
							}

							.b {
							fill: url(#a);
							}

							.c {
							fill: #518ac8;
							}

							.d {
							fill: url(#b);
							}

							.e {
							fill: url(#c);
							}

							.f {
							fill: url(#d);
							}

							.g {
							fill: #58595b;
							}
						</style>
						<linearGradient id="a" x1="11.67" y1="73.36" x2="70.61" y2="44.72" gradientTransform="matrix(1, 0, 0, -1, 0, 73.4)" gradientUnits="userSpaceOnUse">
							<stop offset="0.1" stop-color="#76b3e1"/>
							<stop offset="0.3" stop-color="#dcf2fd"/>
							<stop offset="1" stop-color="#76b3e1"/>
						</linearGradient>
						<linearGradient id="b" x1="44" y1="59.33" x2="33.68" y2="24.96" gradientTransform="matrix(1, 0, 0, -1, 0, 73.4)" gradientUnits="userSpaceOnUse">
							<stop offset="0" stop-color="#76b3e1"/>
							<stop offset="0.5" stop-color="#4377bb"/>
							<stop offset="1" stop-color="#1f3b77"/>
						</linearGradient>
						<linearGradient id="c" x1="7.34" y1="44.34" x2="66.94" y2="3.82" gradientTransform="matrix(1, 0, 0, -1, 0, 73.4)" gradientUnits="userSpaceOnUse">
							<stop offset="0" stop-color="#315aa9"/>
							<stop offset="0.5" stop-color="#518ac8"/>
							<stop offset="1" stop-color="#315aa9"/>
						</linearGradient>
						<linearGradient id="d" x1="34.25" y1="39.49" x2="10.2" y2="-48.7" gradientTransform="matrix(1, 0, 0, -1, 0, 73.4)" gradientUnits="userSpaceOnUse">
							<stop offset="0" stop-color="#4377bb"/>
							<stop offset="0.5" stop-color="#1a336b"/>
							<stop offset="1" stop-color="#1a336b"/>
						</linearGradient>
						</defs>
						<g>
							<path class="a" d="M75.81,15.35S50.86-3.49,31.5.91l-1.7.47A12.35,12.35,0,0,0,23.22,6a11.18,11.18,0,0,0-.71,1.18L15.36,19.33l12.35,2.41A22,22,0,0,0,45.32,25.2l22,4.3Z"/>
							<path class="b" d="M75.81,15.35S50.86-3.49,31.5.91l-1.7.47A12.35,12.35,0,0,0,23.22,6a11.18,11.18,0,0,0-.71,1.18L15.36,19.33l12.35,2.41A22,22,0,0,0,45.32,25.2l22,4.3Z"/>
							<path class="c" d="M23,15.11l-1.71.48c-7.9,2.55-10.6,9.94-6.06,16.42a21.12,21.12,0,0,0,22.54,7.1L67.29,29.5S42.39,10.71,23,15.11Z"/>
							<path class="d" d="M23,15.11l-1.71.48c-7.9,2.55-10.6,9.94-6.06,16.42a21.12,21.12,0,0,0,22.54,7.1L67.29,29.5S42.39,10.71,23,15.11Z"/>
							<path class="e" d="M61.89,36.42a21.11,21.11,0,0,0-22.58-7.15L9.82,38.83.54,55.35l52.83,9,9.47-16.85C64.73,44.27,64.54,40.2,61.89,36.42Z"/>
							<path class="f" d="M52.61,52.94a21.14,21.14,0,0,0-22.53-7.15L.54,55.35s25,18.84,44.31,14.44l1.7-.47C54.46,66.81,57.16,59.42,52.61,52.94Z"/>
						</g>
						</svg>
					`,
					src: resolve("./devToolbarApps/Test.solid.jsx"),
				});

				console.log("VITE PLUGINS", config.vite.plugins?.map(p => p.name))

				// Test addVirtualImports disallowed list
				// addVirtualImports({ "astro:test": "export default {}" });
			},
		};
	},
});

export default testIntegration;
