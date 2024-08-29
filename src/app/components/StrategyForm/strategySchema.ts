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

export const buyConditionSchema = z.discriminatedUnion('type', [
  tokenNameConditionSchema,
  numericConditionSchema,
  ageConditionSchema,
  blacklistConditionSchema,
]);

const buyActionSchema = z.object({
  type: z.literal('fixedAmount'),
  amount: z.number().positive(),
});

const sellConditionSchema = z.object({
  type: z.literal('price'),
  operator: z.enum(['increasedBy', 'decreasedBy']),
  value: z.number().min(0.1),
});

const sellActionSchema = z.object({
  type: z.literal('percentageOfHoldings'),
  amount: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number()
        .min(0.1, 'Sell percentage must be at least 0.1%')
        .max(100, 'Sell percentage cannot exceed 100%')
        .optional(),
    )
    .refine((val) => val !== undefined, 'Sell percentage must be at least 0.1%'),
});

const sellStrategySchema = z.object({
  condition: sellConditionSchema,
  action: sellActionSchema,
});

export const strategySchema = z.object({
  buy: z
    .object({
      conditions: z.array(buyConditionSchema).min(1, 'At least one buy condition is required'),
      action: buyActionSchema,
    })
    .optional(),
  sell: z.array(sellStrategySchema).min(1, 'At least one sell strategy is required').optional(),
});

export type StrategyFormData = z.infer<typeof strategySchema>;

export type BuyCondition = z.infer<typeof buyConditionSchema>;
export type SellStrategy = z.infer<typeof sellStrategySchema>;
