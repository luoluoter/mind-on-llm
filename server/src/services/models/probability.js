import { getLLMClient } from '../llmAdapter.js';

export async function analyzeProbabilityModel(context) {
  const prompt = `
请你扮演概率分析专家。根据以下用户提出的问题，请列出用户面临的可能选择路径，并评估各自成功与失败的大致概率。

问题：${context.question}
用户信息：${JSON.stringify(context.userProfile)}

请输出：
- 可能的3个选择路径（例如继续当前、改变路线、探索B）
- 各路径的成功概率（粗略估算，0-100%）
- 每种失败情境的后果
- 哪个路径概率期望最高，推荐理由
`;

  const llm = getLLMClient();
  const response = await llm.chat(prompt);
  
  return {
    model: '概率模型',
    applicable: true,
    summary: response,
    suggestions: [],
    risks: []
  };
} 