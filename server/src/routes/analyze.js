import express from 'express';
import { analyzeCompoundModel } from '../services/models/compound.js';
import { analyzeProbabilityModel } from '../services/models/probability.js';
import { generateDecisionTree } from '../services/models/decisionTree.js';
import { analyzeGameTheoryModel } from '../services/models/gameTheory.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { question, userProfile } = req.body;

    if (!question) {
      return res.status(400).json({ error: '问题不能为空' });
    }

    const context = { question, userProfile };

    // 并行调用所有模型
    const [compoundResult, probabilityResult, decisionTreeResult, gameTheoryResult] = await Promise.all([
      analyzeCompoundModel(context),
      analyzeProbabilityModel(context),
      generateDecisionTree(context),
      analyzeGameTheoryModel(context)
    ]);

    // 整合所有模型的结果，使用更结构化的格式
    const aggregatedSuggestions = [
      ...(compoundResult.suggestions || []),
      ...(probabilityResult.suggestions || []),
      ...(gameTheoryResult.suggestions || [])
    ].filter(Boolean);

    const aggregatedRisks = [
      ...new Set(
        [...(compoundResult.risks || []), ...(probabilityResult.risks || []), ...(gameTheoryResult.risks || [])].filter(Boolean)
      )
    ];

    const coreSummary =
      compoundResult.coreInsight || compoundResult.summary?.split('\n')[0] || '暂未生成核心问题摘要';

    const response = {
      core_issue: {
        question,
        summary: coreSummary
      },
      models_applied: [
        {
          type: compoundResult.model || '复利模型',
          summary: compoundResult.summary,
          applicable: compoundResult.applicable,
          suggestions: compoundResult.suggestions,
          risks: compoundResult.risks
        },
        {
          type: probabilityResult.model || '概率模型',
          summary: probabilityResult.summary,
          applicable: probabilityResult.applicable,
          suggestions: probabilityResult.suggestions,
          risks: probabilityResult.risks
        },
        {
          type: gameTheoryResult.model || '博弈论模型',
          summary: gameTheoryResult.summary,
          applicable: gameTheoryResult.applicable,
          suggestions: gameTheoryResult.suggestions,
          risks: gameTheoryResult.risks
        }
      ],
      visual_tree: decisionTreeResult.mermaidCode,
      recommendations: {
        primary: aggregatedSuggestions[0] || compoundResult.coreInsight || '暂无主要建议',
        secondary: aggregatedSuggestions[1] || probabilityResult.recommendation || '暂无次要建议',
        additional: aggregatedSuggestions.slice(2),
        risks: aggregatedRisks
      }
    };

    res.json(response);
  } catch (error) {
    console.error('分析过程出错:', error);
    // 根据错误类型返回不同的状态码
    if (error.message.includes('未配置') || error.message.includes('配置不完整')) {
      return res.status(500).json({ 
        error: 'API 配置错误',
        details: error.message 
      });
    }
    if (error.message.includes('API 错误')) {
      return res.status(500).json({ 
        error: 'API 调用失败',
        details: error.message 
      });
    }
    res.status(500).json({ 
      error: '分析过程出错',
      details: error.message 
    });
  }
});

export default router;
