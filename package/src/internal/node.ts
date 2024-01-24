import { access, mkdir } from "node:fs/promises";
import { dirname, extname } from "node:path";

export const ensureDirExists = async (p: string) => {
	const dir = extname(p) === "" ? p : dirname(p);
	try {
		await access(dir);
	} catch (err) {
		await mkdir(dir, { recursive: true });
	}
};
