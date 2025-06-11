import { getLLMClient } from '../llmAdapter.js';

export async function analyzeCompoundModel(context) {
  const prompt = `
你是复利分析专家。请根据以下用户的问题，从是否具备复利效应的角度进行分析：
问题：${context.question}
用户背景：${JSON.stringify(context.userProfile)}

判断该问题涉及的目标行为是否具有复利性质？在多长时间周期下？用户应如何持续投入以发挥复利效应？有哪些中断风险？

请结构化输出：
- 是否具有复利特征（是/否）
- 形成复利的主因
- 建议的投入方式与周期
- 风险与中断点
`;

  const llm = getLLMClient();
  const response = await llm.chat(prompt);
  
  return {
    model: '复利模型',
    applicable: true,
    summary: response,
    suggestions: [],
    risks: []
  };
} 