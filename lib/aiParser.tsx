import axios from 'axios';

import CONFIG from '../common/config';
import {SYSTEM_PROMPT} from '../common/const';
import {T_SMS_Data, T_TransactionObj} from '../common/types';

export async function isOllamaRunning() {
  try {
    const response = await axios.get(CONFIG.OLLAMA.URL);
    console.log('Ollama is running: ', response.status === 200);
    return response.status === 200;
  } catch (error) {
    console.log('Ollama is running: ', false);
    console.log(error);
    return false;
  }
}

export async function smsToTransactionListUsingOpenAI(
  smsList: T_SMS_Data[],
): Promise<T_TransactionObj[]> {
  try {
    if (!smsList.length) {
      return [];
    }
    const smsTexts = smsList.map(sms => sms.body);
    const smsTextsLineSeparated = smsTexts.join('\n');
    const response = await axios.post(
      `${CONFIG.OPEN_AI.URL}/chat/completions`,
      {
        model: CONFIG.OPEN_AI.MODEL, // e.g., 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT.SMS_TO_TRANSACTION_LIST,
          },
          {
            role: 'user',
            content: smsTextsLineSeparated,
          },
        ],
        max_tokens: 1500, // Limits the response to 1500 tokens
        temperature: 0, // Makes the response deterministic and less creative
        // top_p: 1, // Uses the full probability mass for token selection
        // frequency_penalty: 0, // No penalty for token frequency
        // presence_penalty: 0, // No penalty for introducing new topics
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${CONFIG.OPEN_AI.API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    const transactionList = JSON.parse(
      response.data.choices[0].message.content,
    ) as T_TransactionObj[];
    console.log(transactionList);
    transactionList.forEach((t, i) => {
      t.date = smsList[i].date;
      t.body = smsList[i].body;
      t.address = smsList[i].address;
    });
    return transactionList;
  } catch (error: any) {
    console.log(error?.response || error);
    throw error;
  }
}

export async function smsToTransactionListUsingOllama(smsTexts: string[]) {
  try {
    const smsTextsLineSeparated = smsTexts.join('\n');
    const response = await axios.post(`${CONFIG.OLLAMA.URL}/api/chat`, {
      model: CONFIG.OLLAMA.MODEL,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT.SMS_TO_TRANSACTION_LIST,
        },
        {
          role: 'user',
          content: smsTextsLineSeparated,
        },
      ],
      // format: 'json',
      options: {
        temperature: 0,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error parsing SMS texts:', error.response.data);
    return null;
  }
}
