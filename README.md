# 🧠 Mind on LLM

> 使用 LLM 基于高质量的人类思维编排工具
> 目前只是使用AI IDE随手构建的项目

## 📖 项目简介

Mind on LLM 是一个基于大语言模型（LLM）的思维模型编排工具。它旨在通过整合和运用人类历史上最优秀的思维模型，帮助用户更系统、更理性地分析和解决复杂问题。

## 📋 项目 TODO

- [ ] 基于查理·芒格提出的多元思维模型
- [ ] 优化前端，完善后端，完成 PoC
- [ ] 提炼思维模型，封装提升拓展性
- [ ] 收录优质人类思维清单
- [ ] 逐条实现上一步的清单

## ✨ 核心特性

- 🧭 **问题澄清器**：帮助用户从模糊问题出发，聚焦到可分析的核心命题
- 📊 **多元模型分析**：整合复利、概率、组合、期望值、博弈等六大思维模型
- 🌲 **图形化决策树**：可视化展示决策路径及分支风险收益结构
- 📝 **结构化报告**：自动生成分析报告、建议和风险提示
- 🔌 **灵活模型支持**：支持 OpenAI、Azure OpenAI 等多种模型提供商

## 🏗️ 技术架构

### 前端技术栈

- React + Vite
- Tailwind UI
- Mermaid.js（决策树可视化）
- Framer Motion（动画效果）
- Zustand（状态管理）

### 后端技术栈

- Node.js (ESM)
- Express.js
- 可插拔 LLM Adapter
- OpenAI / Azure OpenAI API
- dotenv（配置管理）

## 📁 项目结构

```
mungermind/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── pages/        # 页面组件
│   │   └── ...
│   └── README.md
│
├── server/           # 后端项目
│   ├── src/
│   │   ├── routes/      # API 路由
│   │   ├── services/    # 业务逻辑
│   │   ├── prompts/     # Prompt 模板
│   │   └── utils/       # 工具函数
│   └── README.md
│
└── README.md
```

## 🚀 快速开始

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 后端启动

```bash
cd server
npm install
npm run dev
```

## 🔧 环境配置

1. 复制 `.env.example` 到 `.env`
2. 配置必要的环境变量：
   - `OPENAI_API_KEY`：OpenAI API 密钥
   - `PORT`：服务器端口
   - 其他配置项...

## 📝 使用流程

1. 在首页输入您的问题
2. 系统引导您澄清问题（可选）
3. 多个思维模型并行分析
4. 生成决策树和结构化报告
5. 导出分析结果（可选）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。我们特别欢迎：

- 思维模型的补充和完善
- 代码优化和重构建议
- 文档改进和翻译
- 新功能提案

## 📄 开源协议

本项目采用 MIT 协议开源。
