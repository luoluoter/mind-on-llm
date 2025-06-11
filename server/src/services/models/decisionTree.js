import { getLLMClient } from '../llmAdapter.js';

function extractMermaidCode(text) {
  const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)```/);
  return mermaidMatch ? mermaidMatch[1] : '';
}

export async function generateDecisionTree(context) {
  const prompt = `
请将用户的问题建模为一个简单的"决策树"，每个节点为一个选项，标注概率和期望回报。输出格式为类似于 Markdown 的 mermaid 树图结构。

问题：${context.question}
背景信息：${JSON.stringify(context.userProfile)}

输出格式如下：
\`\`\`mermaid
graph TD
A[是否换工作] --> B1[留下来]
A --> B2[离职创业]

B1 --> C1[保持收入稳定<br>期望：+30万]
B2 --> C2[创业成功<br>概率：30%<br>期望：+100万]
B2 --> C3[创业失败<br>概率：70%<br>期望：-30万]
\`\`\`

请填充该图结构。
`;

  const llm = getLLMClient();
  const response = await llm.chat(prompt);
  
  return {
    model: '决策树模型',
    applicable: true,
    mermaidCode: extractMermaidCode(response),
    rawText: response
  };
} 