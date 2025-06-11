import { useState } from 'react';
import { Transition } from '@headlessui/react';

const questions = [
  {
    id: 'skills',
    question: '请告诉我你的主要技能和经验？',
    placeholder: '例如：项目管理、编程、市场营销等'
  },
  {
    id: 'riskTolerance',
    question: '你对风险的承受能力如何？',
    options: ['保守', '中等', '激进']
  },
  {
    id: 'savings',
    question: '你目前的资金储备情况如何？',
    placeholder: '例如：6个月生活费、1年生活费等'
  },
  {
    id: 'timeframe',
    question: '你期望在多长时间内看到结果？',
    options: ['短期（3个月内）', '中期（6-12个月）', '长期（1年以上）']
  }
];

export function ClarifyFlow({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSkip, setShowSkip] = useState(true);

  const handleAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [questions[currentStep].id]: answer
    };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleSkip = () => {
    setShowSkip(false);
    onSkip();
  };

  return (
    <div className="space-y-6">
      {showSkip && (
        <div className="flex justify-end">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            跳过问答 →
          </button>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, index) => (
          <Transition
            key={q.id}
            show={index === currentStep}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 transform translate-y-4"
            enterTo="opacity-100 transform translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 transform translate-y-0"
            leaveTo="opacity-0 transform -translate-y-4"
          >
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">{q.question}</p>
                  
                  {q.options ? (
                    <div className="space-y-2">
                      {q.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className="w-full text-left px-4 py-2 rounded-md border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={q.placeholder}
                        className="w-full px-4 py-2 rounded-md border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleAnswer(e.target.value.trim());
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input');
                          if (input.value.trim()) {
                            handleAnswer(input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        发送
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Transition>
        ))}
      </div>

      {currentStep > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>问题 {currentStep + 1} / {questions.length}</span>
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            返回上一题
          </button>
        </div>
      )}
    </div>
  );
} 