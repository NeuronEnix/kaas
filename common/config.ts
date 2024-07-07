import env from '../env.json';

const CONFIG = {
  OPEN_AI: {
    API_KEY: env.OPENAI_API_KEY ?? '',
    MODEL: env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
    URL: 'https://api.openai.com/v1',
  },
  OLLAMA: {
    URL: 'http://localhost:11434',
    MODEL: 'gemma:2b',
  },
  GOOGLE: {
    WEB_CLIENT_ID: env.GOOGLE_WEB_CLIENT_ID ?? '',
    ANDROID_CLIENT_ID: env.GOOGLE_ANDROID_CLIENT_ID ?? '',
    SCOPE: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
  },
};

export default CONFIG;
