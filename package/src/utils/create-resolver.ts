import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const createResolver = (_base: string) => {
	let base = _base;
	if (base.startsWith("file://")) {
		base = dirname(fileURLToPath(base));
	}

	return {
		resolve: (...path: Array<string>) => resolve(base, ...path),
	};
};