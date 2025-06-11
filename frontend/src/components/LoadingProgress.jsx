import { useState, useEffect } from 'react';

const steps = [
  '正在分析问题...',
  '应用复利模型...',
  '计算概率分布...',
  '生成决策树...',
  '分析博弈关系...',
  '整合分析结果...'
];

export function LoadingProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // 每2秒更新一次步骤

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 每100ms更新一次进度

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-indigo-600">分析进度</span>
          <span className="text-sm font-medium text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${
              index < currentStep
                ? 'text-green-600'
                : index === currentStep
                ? 'text-indigo-600'
                : 'text-gray-400'
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : index === currentStep ? (
                <div className="w-4 h-4 border-2 border-current rounded-full animate-spin" />
              ) : (
                <div className="w-4 h-4 border-2 border-current rounded-full" />
              )}
            </div>
            <span className="text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 