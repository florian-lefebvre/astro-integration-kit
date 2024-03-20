type DbHooks = Omit<
  import('@astrojs/db/types').AstroDbIntegration['hooks'],
  keyof import('astro').AstroIntegration['hooks']
>;

declare namespace AIK {
  export interface ExtraHooks extends DbHooks { }
}
