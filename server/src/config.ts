import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
  deepseekBaseUrl: 'https://api.deepseek.com/v1/chat/completions',
  deepseekModel: 'deepseek-chat',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
};

