import { bgRed } from 'kleur/colors';
import { env, exit } from 'node:process';
import { safeParse, type ObjectSchema, type SchemaIssue } from 'valibot';
import dotenv from 'dotenv';
import logSymbols from 'log-symbols';
import type { Plugin } from 'esbuild';

type PluginOptions = {
    envFile?: string;
};

/**
 * Exports an Esbuild plugin that validates environment variables against a schema.
 * @param schema
 * @param options
 * @returns
 *
 * @example
 * ```ts
 * import { build } from 'esbuild';
 * import * as v from 'valibot';
 * import valibot from 'esbuild-plugin-valibot-env';
 *
 * const envSchema = v.object({
 * 	ESBUILD_API_ENDPOINT: v.string([v.url()]),
 * 	ESBUILD_ENABLE_LOGGING: v.boolean(),
 * });
 *
 * await build({
 * 	entryPoints: ['demo.ts'],
 * 	plugins: [
 * 		ValibotEnvPlugin(schema)
 * 	],
 * });
 * ```
 */
export default function ValibotEnvPlugin<T extends ObjectSchema<any, any> = ObjectSchema<any, any>>(
    schema: T,
    options: PluginOptions = {
        envFile: undefined
    }
): Plugin {
	return {
    name: 'valibot-env',
    setup() {
        dotenv.config({
            path: options.envFile
        });

        const { issues, success } = safeParse(schema, env);

        if (success) {
            return;
        }

        for (const issue of issues) {
            if (typeof issue === 'undefined') {
                continue;
            }

            logIssue(issue);
        }

        exit(1);
    }
	}
}

/**
 * Logger for printing well-formed schema issues.
 * @param issue
 * @returns
 */
function logIssue(issue: SchemaIssue) {
	if (!issue.path) {
		return;
	}

	const label = bgRed(` ${issue.path[0].key} `);

	console.error(logSymbols.error, label, issue.message);
}
