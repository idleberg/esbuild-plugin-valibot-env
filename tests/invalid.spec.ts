import { build } from 'esbuild';
import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { schema } from './fixtures/invalid.schema';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import valibot from '../index';

test(`Testing valid environment variables`, async () => {
	try {
		await build({
			bundle: true,
			entryPoints: [resolve(cwd(), 'tests/fixtures/app.ts')],
			outfile: 'dist/app.js',
			plugins: [
				valibot(schema, {
					envFile: resolve(cwd(), 'tests/fixtures/.env.invalid'),
				}),
			],
		});
	} catch (error) {
		const count = Object.keys(schema.entries).length;
		assert.instance(error, Error);

		assert.match(
			(error as Error).message,
			`Environment variable validation failed, found ${count} ${count === 1 ? 'issue' : 'issues'}.`,
		);
	}
});

test.run();
