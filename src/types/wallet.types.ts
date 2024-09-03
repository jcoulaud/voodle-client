export type Blockchain = 'ton';

export interface Wallet {
  blockchain: Blockchain;
  address: string;
}

export interface GetUserWalletsData {
  getUserWallets: Wallet[];
}
