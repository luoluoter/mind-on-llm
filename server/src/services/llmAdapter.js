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

class MockLLMClient extends BaseLLMClient {
  constructor() {
    super();
    this.isMock = true;
  }

  buildResponse(prompt) {
    if (prompt.includes('mermaid')) {
      return JSON.stringify({
        summary: '基于用户问题生成的示例决策树',
        mermaid: 'graph TD\n  Start[明确目标] --> A[维持现状]\n  Start --> B[尝试新的路径]\n  A --> A1[收益稳定 <br> 概率：70%]\n  A --> A2[缺乏突破 <br> 概率：30%]\n  B --> B1[成功拓展 <br> 概率：45%]\n  B --> B2[投入成本高 <br> 概率：55%]'
      });
    }

    if (prompt.includes('复利分析专家')) {
      return JSON.stringify({
        summary: '该行动具备明显的复利属性，持续投入时间与资源可以在 2-3 年内形成稳定的复合增长。',
        applicable: true,
        coreInsight: '聚焦长期可积累的动作，并在固定周期内复盘投入产出。',
        suggestions: [
          '设定每季度的投入目标，并记录关键指标以验证复利积累。',
          '为投入建立自动化或半自动化的执行机制，减少中断概率。'
        ],
        risks: [
          '现金流或精力投入被其他事务占用导致中断。',
          '缺乏阶段性复盘，无法及时修正方向。'
        ]
      });
    }

    if (prompt.includes('概率分析专家')) {
      return JSON.stringify({
        summary: '比较三条路径：维持现状、增量投入、彻底转型。增量投入在收益与风险之间取得更好的平衡。',
        applicable: true,
        suggestions: [
          '优先推进“增量投入”方案，以 6 个月为周期评估收益。',
          '为“彻底转型”保留探索预算，在验证关键假设后再扩大投入。'
        ],
        risks: [
          '维持现状可能导致市场份额流失。',
          '彻底转型初期现金流压力较大。'
        ],
        recommendation: '选择增量投入，同时设置风险缓冲。'
      });
    }

    if (prompt.includes('博弈论专家')) {
      return JSON.stringify({
        summary: '当前情境为非零和博弈，存在通过信息共享实现互惠的空间。',
        applicable: true,
        suggestions: [
          '与关键合作方建立定期的对齐机制，透明目标与资源。',
          '设计激励条款，保障合作关系在长期中的稳定性。'
        ],
        risks: [
          '合作方在关键节点选择短期收益最大化策略。',
          '信息不对称导致合作信任度下降。'
        ]
      });
    }

    return JSON.stringify({
      summary: '这是一个示例回复。',
      applicable: true,
      suggestions: [],
      risks: []
    });
  }

  async chat(prompt) {
    return this.buildResponse(prompt);
  }
}

const warnAndFallback = (error) => {
  console.warn(`未能初始化指定的 LLM 客户端，已退回到 mock 模式：${error.message}`);
  return new MockLLMClient();
};

export const getLLMClient = () => {
  const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

  if (provider === 'mock') {
    return new MockLLMClient();
  }

  if (provider === 'azure') {
    try {
      return new CustomAzureOpenAIClient();
    } catch (error) {
      return warnAndFallback(error);
    }
  }

  try {
    return new CustomOpenAIClient();
  } catch (error) {
    return warnAndFallback(error);
  }
};
