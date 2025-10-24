import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DecisionTree } from './DecisionTree';

export function AnalysisResult({ result, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="p-4 bg-red-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">分析出错</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const filteredModels = result.models_applied || [];

  const renderList = (items, emptyLabel) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-gray-400">{emptyLabel}</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    );
  };

  const pickModelTitle = (type) => {
    if (type?.includes('复利')) return '复利模型分析';
    if (type?.includes('概率')) return '概率模型分析';
    if (type?.includes('博弈')) return '博弈论分析';
    return type || '模型分析';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">分析结果</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 核心问题卡片 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg shadow-sm border border-indigo-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">核心问题</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">原始提问</p>
              <p className="text-gray-700 text-sm mb-4 bg-white/70 border border-indigo-100 rounded-md p-3 shadow-inner">
                {result.core_issue?.question || '未提供问题描述'}
              </p>
              <p className="text-sm text-gray-500 mb-2">模型聚合总结</p>
              <div className="prose prose-sm max-w-none text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.core_issue?.summary || '暂无摘要'}
                </ReactMarkdown>
              </div>
            </div>

            {/* 决策树可视化 */}
            {result.visual_tree && (
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">决策树分析</h3>
                </div>
                <div className="flex justify-center">
                  <div className="w-full">
                    <DecisionTree treeData={result.visual_tree} />
                  </div>
                </div>
              </div>
            )}

            {/* 其他模型分析结果 */}
            {filteredModels.map((modelResult, index) => (
              <div
                key={`${modelResult.type || 'model'}-${index}`}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-sm border border-blue-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {pickModelTitle(modelResult.type)}
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {modelResult.summary || '暂无摘要'}
                  </ReactMarkdown>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">建议</h4>
                    {renderList(modelResult.suggestions, '暂无具体建议')}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">潜在风险</h4>
                    {renderList(modelResult.risks, '暂无风险提示')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {result.recommendations && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">综合建议</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">优先行动</h3>
                <p className="text-sm text-gray-700">
                  {result.recommendations.primary || '暂无主要建议'}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">备选方案</h3>
                <p className="text-sm text-gray-700">
                  {result.recommendations.secondary || '暂无次要建议'}
                </p>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-rose-800 mb-2">关注风险</h3>
                {renderList(result.recommendations.risks, '暂无风险提示')}
              </div>
            </div>
            {result.recommendations.additional && result.recommendations.additional.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">补充建议</h3>
                {renderList(result.recommendations.additional, '暂无补充建议')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
