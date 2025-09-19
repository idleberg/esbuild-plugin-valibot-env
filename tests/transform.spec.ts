import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { build } from 'esbuild';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

import valibot from '../src/plugin.ts';
import { schema } from './fixtures/transform.schema.ts';

test('Testing valid environment variables', async () => {
	await build({
		bundle: true,
		entryPoints: [resolve(cwd(), 'tests/fixtures/app.ts')],
		outfile: 'dist/app.js',
		plugins: [
			valibot(schema, {
				envFile: resolve(cwd(), 'tests/fixtures/.env.transform'),
				transformValues: true,
			}),
		],
	});

	assert.ok(true);
});

test.run();
