type DbHooks = Omit<
	import("@astrojs/db/types").AstroDbIntegration["hooks"],
	keyof import("astro").AstroIntegration["hooks"]
>;

declare namespace AstroIntegrationKit {
	export interface ExtraHooks extends DbHooks {}
}
