import { z } from 'zod';

const conditionSchema = z.object({
  type: z.enum(['price', 'volume', 'marketCap']),
  operator: z.enum(['greaterThan', 'lessThan', 'equalTo']),
  value: z.number(),
  days: z.number().optional(),
});

const buyActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fixedAmount'),
    amount: z.number().positive(),
  }),
  z.object({
    type: z.literal('percentageOfBalance'),
    percentage: z.number().min(0).max(100),
  }),
  z.object({
    type: z.literal('all'),
  }),
  z.object({
    type: z.literal('half'),
  }),
]);

export const strategySchema = z.object({
  buy: z.object({
    conditions: z.array(conditionSchema),
    action: buyActionSchema,
  }),
  sell: z.array(
    z.object({
      condition: z.enum(['priceIncrease', 'priceDecrease']),
      percentage: z.number().min(0).max(100),
    }),
  ),
});

export type StrategyFormData = z.infer<typeof strategySchema>;
