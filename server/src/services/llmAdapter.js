import OpenAI from 'openai';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class BaseLLMClient {
  async chat(prompt) {
    throw new Error('Method not implemented');
  }
}

class CustomOpenAIClient extends BaseLLMClient {
  constructor() {
    super();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY 未配置');
    }
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  async chat(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API 调用错误:', error);
      throw new Error(`OpenAI API 错误: ${error.message}`);
    }
  }
}

class CustomAzureOpenAIClient extends BaseLLMClient {
  constructor() {
    super();
    if (
      !process.env.AZURE_API_KEY ||
      !process.env.AZURE_ENDPOINT ||
      !process.env.AZURE_DEPLOYMENT_NAME
    ) {
      throw new Error(
        'Azure OpenAI 配置不完整，请检查 AZURE_API_KEY、AZURE_ENDPOINT 和 AZURE_DEPLOYMENT_NAME'
      );
    }
    this.client = new AzureOpenAI({
      apiKey: process.env.AZURE_API_KEY,
      endpoint: process.env.AZURE_ENDPOINT,
      deployment: process.env.AZURE_DEPLOYMENT_NAME,
      apiVersion: '2024-04-01-preview',
    });
  }

  async chat(prompt) {
    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Azure OpenAI API 调用错误:', error);
      throw new Error(`Azure OpenAI API 错误: ${error.message}`);
    }
  }
}

export const getLLMClient = () => {
  const provider = process.env.LLM_PROVIDER || 'openai';
  if (provider === 'azure') {
    return new CustomAzureOpenAIClient();
  }
  return new CustomOpenAIClient();
};
