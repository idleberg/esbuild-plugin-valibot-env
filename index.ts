import { bgRed } from 'kleur/colors';
import { env, exit } from 'node:process';
import { safeParse, type ObjectSchema, type SchemaIssue } from 'valibot';
import dotenv from 'dotenv';
import logSymbols from 'log-symbols';
import type { Plugin } from 'esbuild';

type PluginOptions = {
	envFile?: string;
	transformValues?: boolean;
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
 * 		valibot(schema),
 * 	],
 * });
 * ```
 */
export default function ValibotEnvPlugin<T extends ObjectSchema<any, any> = ObjectSchema<any, any>>(
	schema: T,
	options: PluginOptions = {
		envFile: undefined,
		transformValues: false,
	},
): Plugin {
	return {
		name: 'valibot-env',
		setup() {
			dotenv.config({
				path: options.envFile,
			});

			const envVars = options.transformValues ? transformEnvironment(env as Record<string, string>) : env;
			const { issues, success } = safeParse(schema, envVars);

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
		},
	};
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

/**
 * Transforms values of an environment variables object to their respective types.
 * @param env
 * @returns
 */
function transformEnvironment(env: Record<string, string>): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(env).map(([key, value]) => {
			return [key, transformString(value)];
		}),
	);
}

/**
 * Transforms a string to its respective primitive type.
 * @param value
 * @returns
 */
function transformString(value: string): unknown {
	switch (true) {
		case value === 'null':
		case value === 'true':
		case value === 'false':
			return JSON.parse(value);

		case /^-?\d+$/.test(value):
			return parseInt(value, 10);

		case /^-?\d+\.\d+$/.test(value):
			return parseFloat(value);

		default:
			return value;
	}
}
