export enum TransactionStatus {
  Success = 'success',
  Failed = 'failed',
  Pending = 'pending',
}

export enum TransactionType {
  Buy = 'buy',
  Sell = 'sell',
}

export interface Transaction {
  id: number;
  created_at: Date;
  token_id: number;
  strategy_id: number;
  user_id: number;
  type: TransactionType;
  amount_token: string;
  amount_ton: string;
  price_in_usd: string;
  dex: string;
  status: TransactionStatus;
  transaction_id?: string;
}
