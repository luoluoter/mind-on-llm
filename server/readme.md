# 🧠 MungerMind · 多元思维模型问题分析工具

## 项目简介

**MungerMind** 是一个基于查理·芒格提出的多元思维模型（Mental Models）构建的智能问题分析器。用户可以输入他们面对的模糊或具体问题，系统通过模型启发、推理和工具引导，辅助用户更清晰、更系统、更理性地做决策。

---

## ✨ 核心特性

* 🧭 **问题澄清器**：帮助用户从模糊问题出发，聚焦到可分析的核心命题
* 📊 **多元模型引导分析**：复利、概率、组合、期望值、博弈等六大模型驱动
* 🌲 **图形化决策树生成**：可交互式地标注路径概率与收益
* 🔁 **模型结果结构化输出**：分析报告 + 建议 + 风险提示
* 🔌 **支持多模型 API 提供商**：OpenAI / Azure OpenAI / 本地模型灵活切换

---

## 🏗️ 技术栈

| 类型     | 工具/框架                                 |
| ------ | ------------------------------------- |
| 服务端    | Node.js (ESM)                         |
| Web 框架 | Express.js                            |
| 接口抽象层  | 可插拔 LLM Adapter                       |
| 调用模型   | OpenAI, Azure OpenAI                  |
| 结构化推理  | Prompt Engineering + Chain of Thought |
| 配置管理   | dotenv                                |

---

## 📁 项目结构

```txt
mungermind/
│
├── /src
│   ├── server.js               # 入口服务
│   ├── routes/
│   │   └── analyze.js          # 问题分析接口路由
│   ├── services/
│   │   ├── llmAdapter.js       # 通用大模型调用抽象层
│   │   └── models/
│   │       ├── compound.js     # 复利模型分析器
│   │       ├── probability.js  # 概率模型分析器
│   │       ├── decisionTree.js # 决策树生成器
│   │       └── gameTheory.js   # 博弈分析模块
│   ├── prompts/
│   │   └── basePrompt.js       # Prompt 模板
│   └── utils/
│       └── formatters.js       # 格式化 & 辅助函数
│
├── .env                        # 配置 API Key、模型提供商等
├── package.json
└── README.md
```

---

## 🧠 模块 POC 实现思路（Node.js）

下面是对这几个核心模块（复利、概率、决策树、博弈）在 POC（Proof of Concept）阶段的实现思路和接口草案设计。我们保持它们模块化、可组合，并基于统一的 LLM 调用抽象层实现。

每个模型模块结构统一，具有以下特征：

| 特征        | 内容                                            |
| --------- | --------------------------------------------- |
| 接口函数      | `analyze(input: UserQuestionContext): Result` |
| 调用方式      | 使用 `llmAdapter.js` 调用 LLM 推理结果                |
| Prompt 使用 | 模板 + 用户问题上下文                                  |
| 输出结构统一    | 模型结论、风险提示、是否适用于该问题等信息                         |

---

### 1️⃣ `compound.js`（复利模型分析器）

#### 🎯 用途：评估某个行为是否具备“长期复利”潜力（财富、技能、人脉）

#### 接口定义

```js
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
  return await llm.chat(prompt);
}
```

---

### 2️⃣ `probability.js`（概率模型分析器）

#### 🎯 用途：帮助用户理性评估行为路径的胜率与风险分布

#### 接口定义

```js
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
  return await llm.chat(prompt);
}
```

---

### 3️⃣ `decisionTree.js`（图形化决策树生成器）

#### 🎯 用途：可视化用户决策路径及分支风险收益结构

#### 接口定义

```js
export async function generateDecisionTree(context) {
  const prompt = `
请将用户的问题建模为一个简单的“决策树”，每个节点为一个选项，标注概率和期望回报。输出格式为类似于 Markdown 的 mermaid 树图结构。

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
    mermaidCode: extractMermaidCode(response),
    rawText: response,
  };
}
```

---

### 4️⃣ `gameTheory.js`（博弈分析模块）

#### 🎯 用途：识别用户处于博弈关系中时的策略最优化（合作/对抗/退出）

#### 接口定义

```js
export async function analyzeGameTheoryModel(context) {
  const prompt = `
你是一位博弈论专家。请基于以下用户提出的问题，分析其中可能涉及的多方互动关系（例如个人与雇主、用户与市场、平台与平台等），并判断当前行为是否属于零和博弈，是否存在可持续合作策略？

问题：${context.question}
背景信息：${JSON.stringify(context.userProfile)}

请结构化输出：
- 博弈参与方（如：个人 vs 公司）
- 当前博弈类型（零和 / 非零和 / 进化型）
- 最佳策略建议（合作 / 退出 / 变更结构）
- 现实应用建议
`;
  const llm = getLLMClient();
  return await llm.chat(prompt);
}
```

---

### ✅ 共通输出格式建议

每个模块统一返回结构如下，便于前端渲染与后续合成分析报告：

```ts
{
  model: '复利模型',
  applicable: true,
  summary: '该行为具备显著复利潜力，建议持续3年以上投入。',
  suggestions: [
    '每月持续积累专业作品',
    '将复利结果记录量化（如粉丝数、项目经验）',
    '避免跳跃型方向变更'
  ],
  risks: ['频繁中断导致复利断裂', '无法坚持长期输出']
}
```

---

### 🧩 模块组合建议

主控制逻辑（如 `analyze.js`）可根据问题类型或用户选择自动组合多个模型：

```js
// 动态组合模型调用
const results = await Promise.all([
  analyzeCompoundModel(context),
  analyzeProbabilityModel(context),
  generateDecisionTree(context),
]);
```

---

## 🚀 快速启动

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 配置环境变量

创建 `.env` 文件并填入以下内容：

```env
# 选择模型提供方：openai | azure
LLM_PROVIDER=openai

# OpenAI
OPENAI_API_KEY=sk-...

# Azure
AZURE_API_KEY=...
AZURE_ENDPOINT=https://xxx.openai.azure.com
AZURE_DEPLOYMENT_NAME=gpt-4
```

### 3️⃣ 启动本地服务

```bash
npm run dev
```

服务默认运行在 `http://localhost:3000`

---

## 🧠 API 示例

### `POST /analyze`

用于提交用户问题，系统将分析并返回建议结构。

#### 请求体

```json
{
  "question": "我是否应该离职去做自由职业？",
  "userProfile": {
    "skills": "品牌咨询、内容营销",
    "riskTolerance": "中等",
    "savings": "6个月生活费"
  }
}
```

#### 响应体（示例）

```json
{
  "core_issue": "职业转型与长期价值最大化的冲突",
  "models_applied": [
    "复利分析：建立个人品牌将带来长期复利",
    "概率评估：60%成功概率，30%不确定，10%失败",
    "组合分析：技能结构良好，资金储备偏紧，建议风险缓释",
    "博弈关系：可与前雇主尝试部分合作，避免对抗局面"
  ],
  "expected_value": "+80万预期收益（两年内）",
  "visual_tree": "https://yourdomain.com/trees/user123.png"
}
```

---

## 🔌 插件式大模型调用（`llmAdapter.js`）

```js
// 自动选择调用 OpenAI 或 Azure 接口
import { OpenAIClient } from './providers/openai.js';
import { AzureClient } from './providers/azure.js';

export const getLLMClient = () => {
  const provider = process.env.LLM_PROVIDER;
  if (provider === 'azure') return new AzureClient();
  return new OpenAIClient();
};
```

---

## 🧱 后续扩展计划

* ✅ 前端 Web UI（React + Tailwind + Mermaid.js）
* 🔁 多轮交互问答式分析（类似 Chatflow）
* 🧩 用户问题向量化 → 模型自动匹配
* 📈 用户行为数据分析（辅助推荐模型路径）
* 🔐 用户登录 / 数据存储（MongoDB 或 SQLite）

---

## 📜 许可协议

MIT License

---

## ✍️ 作者

由 Luoluoter 个人开发。灵感来自查理·芒格的《穷查理宝典》。
意见与合作欢迎联系：`luozhixin2021@gmail.com`
