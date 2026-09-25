import { registerAs } from '@nestjs/config';
import * as z from 'zod';

export function validateEnvWithZod<T>({
  schema,
  value,
}: {
  schema: z.ZodType<T>;
  value: Record<string, unknown>;
}): T {
  const safeParseResult = schema.safeParse(value);

  if (!safeParseResult.success) {
    const invalidValues = safeParseResult.error.issues.map((issue) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      invalidValue: issue.path.reduce((obj: any, key) => obj?.[key], value),
      message: issue.message,
      path: issue.path.join('.'),
    }));

    console.error(
      '❌ Invalid environment variables detected:',
      JSON.stringify(invalidValues, null, 2),
    );

    throw new Error('Invalid environment variables');
  }

  console.log('environment : ', safeParseResult.data);

  return safeParseResult.data;
}

export default registerAs('config', () =>
  validateEnvWithZod({
    schema: z.union([
      z.object({
        API_KEY: z.string().nonempty('API_KEY is required'),
        NODE_ENV: z.literal('production'),
        OPEN_WEATHER_MAP_API_KEY: z
          .string()
          .nonempty('OPEN_WEATHER_MAP_API_KEY is required'),
        OPEN_WEATHER_MAP_URL: z.url(),
      }),
      z.object({
        API_KEY: z.string().default(''),
        NODE_ENV: z.literal(['dev', 'developpement', 'local']),
        OPEN_WEATHER_MAP_API_KEY: z.string().optional(),
        OPEN_WEATHER_MAP_URL: z.url().optional(),
      }),
    ]),
    value: process.env,
  }),
);
