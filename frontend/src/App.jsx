import { useState } from 'react'
import { QuestionInput } from './components/QuestionInput'
import { AnalysisResult } from './components/AnalysisResult'
import { LoadingProgress } from './components/LoadingProgress'
import { ClarifyFlow } from './components/ClarifyFlow'
import { API_BASE_URL, DEFAULT_FETCH_OPTIONS } from './config'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [userProfile, setUserProfile] = useState({
    skills: '',
    riskTolerance: '中等',
    savings: ''
  })
  const [selectedModels] = useState(['复利模型', '概率模型', '决策树', '博弈论'])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showClarify, setShowClarify] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return
    
    if (!showClarify) {
      setShowClarify(true)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        ...DEFAULT_FETCH_OPTIONS,
        method: 'POST',
        body: JSON.stringify({
          question,
          userProfile,
          models: selectedModels
        }),
      })

      if (!response.ok) {
        throw new Error('分析请求失败')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClarifyComplete = (answers) => {
    setUserProfile(prev => ({
      ...prev,
      ...answers
    }))
    handleSubmit(new Event('submit'))
  }

  const handleClarifySkip = () => {
    handleSubmit(new Event('submit'))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">🧠 MungerMind 多元思维模型分析</h1>
              
              {!showClarify ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <QuestionInput
                    question={question}
                    setQuestion={setQuestion}
                  />
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!question.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      下一步
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">你的问题</h3>
                    <p className="text-gray-700">{question}</p>
                  </div>

                  {!isLoading ? (
                    <ClarifyFlow
                      onComplete={handleClarifyComplete}
                      onSkip={handleClarifySkip}
                    />
                  ) : (
                    <LoadingProgress />
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
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
              )}

              {result && <AnalysisResult result={result} isLoading={isLoading} error={error} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
