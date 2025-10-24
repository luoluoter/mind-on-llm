import OpenAI from 'openai';
import { AzureOpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const MOCK_TAG = '[MOCK]';

class BaseLLMClient {
  async chat(prompt) {
    throw new Error('Method not implemented');
  }
}

class MockLLMClient extends BaseLLMClient {
  constructor() {
    super();
    console.warn('使用 Mock LLM 客户端，返回预置示例数据');
  }

  async chat(prompt) {
    if (prompt.includes('mermaid')) {
      return `${MOCK_TAG}\n这里是一个示例决策树：\n\n\`\`\`mermaid\ngraph TD\n  A[是否推进项目] --> B1[继续推进]<br>概率：60%<br>期望收益：+80万\n  A --> B2[暂缓决策]<br>概率：25%<br>期望收益：+10万\n  A --> B3[终止项目]<br>概率：15%<br>期望收益：-5万\n\`\`\`\n`;
    }

    if (prompt.includes('复利分析专家')) {
      return `${MOCK_TAG}\nSummary: 该行为具备复利潜力，通过持续投入学习与网络搭建可在 3-5 年内形成复利收益。\nSuggestions:\n1. 设定每季度的技能学习计划并记录复盘。\n2. 将人脉拓展与行业分享结合，形成长期合作循环。\nRisks:\n- 中断投入导致复利积累减弱。\n- 盲目扩张带来的资源分散。\n`;
    }

    if (prompt.includes('概率分析专家')) {
      return `${MOCK_TAG}\nSummary: 三条路径中，渐进式优化的成功概率最高，可平衡风险与收益。\nSuggestions:\n1. 首选在现有岗位内拓展新职责并积累成果。\n2. 将探索型副项目作为备选策略，设定明确的试错周期。\nRisks:\n- 直接离职创业导致现金流断裂。\n- 过度保守可能错失行业红利。\n`;
    }

    if (prompt.includes('博弈论专家')) {
      return `${MOCK_TAG}\nSummary: 当前与雇主属于非零和博弈，可通过信息透明与利益共享实现共赢。\nSuggestions:\n1. 主动沟通绩效目标，争取资源支持。\n2. 设计合作激励条款，使双方收益绑定。\nRisks:\n- 信息不对称导致信任损耗。\n- 合作条款缺乏约束力时易回到零和状态。\n`;
    }

    return `${MOCK_TAG}\nSummary: 这是一个示例回复，用于在没有真实模型时验证流程。\nSuggestions:\n- 明确目标并拆解行动步骤。\n- 设置阶段性复盘节点。\nRisks:\n- 长期缺乏反馈可能导致偏离方向。\n`;
  }
}

class CustomOpenAIClient extends BaseLLMClient {
  constructor() {
    super();
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

const hasOpenAIConfig = () => Boolean(process.env.OPENAI_API_KEY);

const hasAzureConfig = () =>
  Boolean(
    process.env.AZURE_API_KEY &&
      process.env.AZURE_ENDPOINT &&
      process.env.AZURE_DEPLOYMENT_NAME
  );

export const getLLMClient = () => {
  const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

  if (provider === 'mock') {
    return new MockLLMClient();
  }

  if (provider === 'azure') {
    if (!hasAzureConfig()) {
      console.warn('检测到 Azure 配置缺失，自动切换到 Mock 模式');
      return new MockLLMClient();
    }
    return new CustomAzureOpenAIClient();
  }

  if (!hasOpenAIConfig()) {
    console.warn('未检测到 OpenAI API Key，自动切换到 Mock 模式');
    return new MockLLMClient();
  }

  return new CustomOpenAIClient();
};

export { MOCK_TAG };
