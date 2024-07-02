const CONFIG = {
  OPEN_AI: {
    API_KEY: process.env.OPEN_AI_API_KEY || 'api-key',
    MODEL: process.env.OPEN_AI_MODEL ?? 'gpt-3.5-turbo',
  },
};

export default CONFIG;
