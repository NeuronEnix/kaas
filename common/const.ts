export const SYSTEM_PROMPT = {
  SMS_TO_TRANSACTION_LIST: `
  You are a system that parses SMS text sent by the user. The user will send SMS as line-separated text, where each line represents a different SMS. You need to parse this and respond with an array of JSON objects containing transaction details. If an SMS is not a transaction, you should return an empty JSON object.

  1. Check if the SMS is a transaction.
  2. If the SMS is not a transaction, return a JSON object: { "isTransaction": false }.
  3. If the SMS is a transaction, return a JSON object with the following details (use null if a detail is not present):
      - isTransaction: true
      - transactionType: "credit" or "debit"
      - from: "from what bank or account"
      - to: "to what bank or account"
      - amount: "transaction amount, only include number"
      - currency: "currency type in words, like 'USD', 'EUR', 'INR', etc"
      - availableBalance: "available balance, only include number"
      - referenceNumber: "if present"
  4. Return the accumulated JSON objects of each transaction SMS as an array of JSON objects.
`,
};

export const GOOGLE = {
  URL: {
    GMAIL_THREADS: 'https://gmail.googleapis.com/gmail/v1/users/me/threads',
  },
};

export const ASSETS = {
  LOGO: './assets/icons/kaasai.png',
};

export const TRANSACTION_FILTER_WORD = [
  // eslint-disable-next-line prettier/prettier
  'transaction', 'purchase', 'payment', 'deposit', 'withdrawal', 'withdrawn', 'credit', 'debit',
  // eslint-disable-next-line prettier/prettier
  'balance', 'transfer', 'charged', 'charge', 'receipt', 'refund', 'ATM', 'POS', 'spent', 'paid',
  // eslint-disable-next-line prettier/prettier
  'amount', 'statement', 'available', 'processed', 'settled', 'instalment', 'received',
];
