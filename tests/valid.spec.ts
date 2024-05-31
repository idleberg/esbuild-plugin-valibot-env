import { build } from 'esbuild';
import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { schema } from './fixtures/valid.schema';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import valibot from '../index';

test(`Testing valid environment variables`, async () => {
	await build({
		bundle: true,
		entryPoints: [resolve(cwd(), 'tests/fixtures/app.ts')],
		outfile: 'dist/app.js',
		plugins: [
			valibot(schema, {
				envFile: resolve(cwd(), 'tests/fixtures/.env.valid'),
			}),
		],
	});

	assert.ok(true);
});

test.run();
