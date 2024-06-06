# esbuild-plugin-valibot-env

> Esbuild plugin to validate environment variables against a Valibot schema.

[![License](https://img.shields.io/github/license/idleberg/esbuild-plugin-valibot-env?color=blue&style=for-the-badge)](https://github.com/idleberg/esbuild-plugin-valibot-env/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/esbuild-plugin-valibot-env?style=for-the-badge)](https://www.npmjs.org/package/esbuild-plugin-valibot-env)
[![Version: jsr](https://img.shields.io/jsr/v/@idleberg/esbuild-plugin-valibot-env?style=for-the-badge)](https://jsr.io/@idleberg/esbuild-plugin-valibot-env)
[![CI: Node](https://img.shields.io/github/actions/workflow/status/idleberg/esbuild-plugin-valibot-env/node.yml?logo=nodedotjs&logoColor=white&style=for-the-badge)](https://github.com/idleberg/esbuild-plugin-valibot-env/actions)
[![CI: Deno](https://img.shields.io/github/actions/workflow/status/idleberg/esbuild-plugin-valibot-env/deno.yml?logo=deno&logoColor=white&style=for-the-badge)](https://github.com/idleberg/esbuild-plugin-valibot-env/actions)

## Why?

It's generally a good idea to check that you're all set up early in the development process. Validating that your environment variables have been defined and are of the expected type is a part of that – for yourself and your colleagues. While there are _many_ libraries to validate against a schema, [Valibot](https://valibot.dev/) stands out for its versatility and modularity. The small footprint makes it an ideal candidate for validation in the frontend. So why not use it in your development process as well?

## Installation

`npm install -D esbuild-plugin-valibot-env valibot`

## Usage

Let's start with a very basic example

```ts
import { build } from 'esbuild';
import * as v from 'valibot';
import valibot from 'esbuild-plugin-valibot-env';

const envSchema = v.object({
	ESBUILD_API_ENDPOINT: v.pipe([v.string(), v.url()]),
	ESBUILD_LOCALE: v.literal('en_US'),
});

await build({
	entryPoints: ['demo.ts'],
	plugins: [
		valibot(schema),
	],
});
```

### API

`valibot(schema, options?)`

### Options

#### `options.envFile`

Type: `String`  
Default: `".env"`  

Specify a path to an `.env` file. It will be passed to the `dotenv` package.

#### `options.transformValues`

Type: `Boolean`  
Default: `false`  

Setting this to `true` will try and transform string values to their respective types. Supports booleans, integers, floats, and `null`.

## Related

- [vite-plugin-valibot-env](https://github.com/idleberg/vite-plugin-valibot-env)

## License

This work is licensed under [The MIT License](LICENSE).
