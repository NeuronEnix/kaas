export type T_TransactionObj = {
  isTransaction: boolean;
  transactionType: 'credit' | 'debit';
  from: string | null;
  to: string | null;
  amount: string | null;
  currency: string | null;
  availableBalance: string | null;
  referenceNumber: string | null;
};
