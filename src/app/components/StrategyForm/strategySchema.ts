import { z } from 'zod';

export const baseConditionSchema = z.object({
  type: z.enum(['tokenName', 'marketCap', 'liquidity', 'price', 'age', 'blacklist']),
});

const tokenNameConditionSchema = baseConditionSchema.extend({
  type: z.literal('tokenName'),
  operator: z.literal('contains'),
  value: z.string(),
});

const numericConditionSchema = baseConditionSchema.extend({
  type: z.enum(['marketCap', 'liquidity', 'price']),
  operator: z.enum(['greaterThan', 'lessThan', 'between']),
  value: z.union([z.number(), z.tuple([z.number(), z.number()])]),
});

const ageConditionSchema = baseConditionSchema.extend({
  type: z.literal('age'),
  days: z.number(),
  operator: z.enum(['greaterThan', 'lessThan', 'equal']),
});

const blacklistConditionSchema = baseConditionSchema.extend({
  type: z.literal('blacklist'),
  checkDollarSign: z.boolean(),
  checkBlacklist: z.boolean(),
});

export const conditionSchema = z.discriminatedUnion('type', [
  tokenNameConditionSchema,
  numericConditionSchema,
  ageConditionSchema,
  blacklistConditionSchema,
]);

const buyActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('fixedAmount'),
    amount: z.number().positive(),
  }),
]);

export const strategySchema = z.object({
  buy: z.object({
    conditions: z.array(conditionSchema).min(1, 'At least one condition is required'),
    action: buyActionSchema,
  }),
  sell: z
    .array(
      z.object({
        condition: z.enum(['priceIncrease', 'priceDecrease']),
        percentage: z
          .number()
          .min(0, 'Percentage must be at least 0')
          .max(100, 'Percentage cannot exceed 100'),
      }),
    )
    .min(1, 'At least one sell condition is required'),
});

export type StrategyFormData = z.infer<typeof strategySchema>;

export type Condition = z.infer<typeof conditionSchema>;
