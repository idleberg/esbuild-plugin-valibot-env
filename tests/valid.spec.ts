import { build } from 'esbuild';
import { resolve } from 'node:path';
import { schema } from './fixtures/valid.schema';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import valibot from '../index';

test(`Testing valid environment variables`, async () => {
	await build({
		bundle: true,
		entryPoints: [resolve(__dirname, 'fixtures/app.ts')],
		outfile: 'dist/app.js',
		plugins: [
			valibot(schema, {
				envFile: resolve(__dirname, 'fixtures/.env.valid'),
			}),
		],
	});

	assert.ok(true);
});

test.run();
