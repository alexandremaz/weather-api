import * as z from 'zod';

export const findWeatherByCityQueryParamsSchema = z.object({
  city: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .describe("City's weather we are looking for"),
});

export type FindWeatherByCityQueryParamsDto = z.infer<
  typeof findWeatherByCityQueryParamsSchema
>;
