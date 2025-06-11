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

  // 过滤掉决策树分析（因为已经有可视化）
  const filteredModels = result.models_applied.filter((_, index) => index !== 2);

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
              <div className="prose prose-sm max-w-none text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.core_issue}
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
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow-sm border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    {index === 0 ? (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {index === 0 ? '复利模型分析' :
                     index === 1 ? '概率模型分析' :
                     '博弈论分析'}
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {modelResult}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 