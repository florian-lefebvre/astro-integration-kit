# `astro-kit`

This is a package that contains utilities to help you build Astro integrations.

## Usage

### Prerequisites

TODO:

### Installation

Install the integration **automatically** using the Astro CLI:

```bash
pnpm astro add astro-kit
```

```bash
npm astro add astro-kit
```

```bash
yarn astro add astro-kit
```

Or install it **manually**:

1. Install the required dependencies

```bash
pnpm add astro-kit
```

```bash
npm install astro-kit
```

```bash
yarn add astro-kit
```

2. Add the integration to your astro config

```diff
+import integration from "astro-kit";

export default defineConfig({
  integrations: [
+    integration(),
  ],
});
```

### Configuration

TODO:configuration

## Contributing

This package is structured as a monorepo:

- `playground` contains code for testing the package
- `package` contains the actual package

Install dependencies using pnpm: 

```bash
pnpm i --frozen-lockfile
```

Start the playground:

```bash
pnpm playground:dev
```

You can now edit files in `package`. Please note that making changes to those files may require restarting the playground dev server.

## Licensing

[MIT Licensed](https://github.com/florian-lefebvre/astro-kit/blob/main/LICENSE). Made with ❤️ by [Florian Lefebvre](https://github.com/florian-lefebvre).
