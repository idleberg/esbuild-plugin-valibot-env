import { env } from 'node:process';
import { safeParse, type InferIssue, type ObjectSchema } from 'valibot';
import { type Plugin } from 'esbuild';
import dotenv from 'dotenv';

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
 * 	ESBUILD_API_ENDPOINT: v.pipe(v.string(), v.url()),
 * 	ESBUILD_LOCALE: v.literal('en_US'),
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
		setup({ onLoad }) {
			dotenv.config({
				path: options.envFile,
			});

			const envVars = options.transformValues ? transformEnvironment(env as Record<string, string>) : env;
			const { issues, success } = safeParse(schema, envVars);

			if (success) {
				return;
			}

			let counter = 0;

			onLoad({ filter: /\.*/ }, (args) => {
				counter++;

				return {
					errors:
						counter > 1
							? undefined
							: issues?.map((issue: InferIssue<any>) => {
									return {
										id: args.path,
										pluginName: 'valibot-env',
										detail: issue.path[0].key,
										text: `[${issue.path[0].key}] ${issue.message}`,
									};
								}),
				};
			});
		},
	};
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
