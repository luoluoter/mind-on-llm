export function QuestionInput({ question, setQuestion }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          请描述你的问题
        </label>
        <div className="mt-1">
          <textarea
            id="question"
            name="question"
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="例如：我是否应该接这个副业项目？"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          请尽可能详细地描述你的问题，这将帮助我们提供更准确的分析。
        </p>
      </div>
    </div>
  );
} 