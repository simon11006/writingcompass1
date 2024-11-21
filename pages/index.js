import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    grade: '',
    class: '',
    number: '',
    name: '',
    title: '',
    content: '',
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 분석하기 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('분석 요청 실패');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 제목 및 설명 */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
        <div className="title-container">
          <h1 className="main-title">글쓰기 나침반</h1>
          <p className="subtitle">글쓰기 능력 향상을 위한 맞춤형 분석 도우미</p>
        </div>

        {/* 입력 필드 */}
        <div className="input-grid mb-4">
          {['grade', 'class', 'number', 'name'].map((field) => (
            <input
              key={field}
              type="text"
              id={field}
              placeholder={
                field === 'grade'
                  ? '학년'
                  : field === 'class'
                  ? '반'
                  : field === 'number'
                  ? '번호'
                  : '이름'
              }
              className="border p-2 sm:p-3 rounded text-lg w-full"
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
        </div>

        <input
          type="text"
          id="title"
          placeholder="제목"
          className="border p-2 sm:p-3 rounded w-full mb-4 text-lg"
          value={formData.title}
          onChange={handleChange}
        />

        {/* 글쓰기 영역 */}
        <div className="textarea-container">
          <div className="writing-guide">
            <div className="guide-title">
              <span className="guide-icon">✍️</span>
              좋은 글쓰기 도움말
            </div>
            <ul className="guide-tips">
              <li>• 한 문단은 3~5개의 문장으로 구성해요</li>
              <li>• 새로운 내용이 시작되면 문단을 나눠요</li>
              <li>• 문단의 첫 문장은 내용을 요약해요</li>
            </ul>
          </div>

          <textarea
            id="content"
            placeholder="이곳에 글을 작성하세요."
            className="border p-2 sm:p-3 rounded w-full h-64 text-lg"
            value={formData.content}
            onChange={handleChange}
          ></textarea>

          {/* 글쓰기 피드백 */}
          <div className="writing-feedback">
            <div className="char-count">
              <span>글자수: {formData.content.length}자</span>
            </div>
            {/* 추가적인 피드백 요소를 필요에 따라 추가 */}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-lg font-medium hover:bg-blue-600 w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? '분석중...' : '분석하기'}
        </button>
      </div>

      {/* 분석 결과 */}
      {analysisResult && (
        <div id="result" className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6">
          <h2 className="section-title">분석 결과</h2>
          {/* 분석 결과를 적절한 컴포넌트로 구성 */}
          <pre className="whitespace-pre-wrap">{analysisResult}</pre>
        </div>
      )}
    </div>
  );
}
