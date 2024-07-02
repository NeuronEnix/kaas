export type T_SMS_Data = {
  date: Date;
  body: string;
  address: string;
};

export type T_TransactionObj = T_SMS_Data & {
  isTransaction: boolean;
  transactionType: 'credit' | 'debit';
  from: string | null;
  to: string | null;
  amount: string | null;
  currency: string | null;
  availableBalance: string | null;
  referenceNumber: string | null;
};
