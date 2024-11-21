import { useState } from 'react';

export default function Home() {
  const [essayData, setEssayData] = useState({
    grade: '',
    class: '',
    number: '',
    name: '',
    title: '',
    content: '',
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [paragraphAnalysis, setParagraphAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEssayData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === 'content') {
      // 글자 수 업데이트
      setCharCount(value.replace(/\n/g, '').length);
      // 문단 수 업데이트
      const paragraphs = value.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
      setParagraphCount(paragraphs.length);
      // 문단 분석 업데이트
      updateParagraphAnalysis(paragraphs.length);
    }
  };

  // 문단 분석 업데이트 함수
  const updateParagraphAnalysis = (count) => {
    let message = '';

    switch (count) {
      case 0:
        message = '글을 작성해주세요';
        break;
      case 1:
        message = '첫 문단을 작성했네요. 새로운 내용이 시작되면 엔터키를 눌러주세요.';
        break;
      case 2:
        message = '좋아요! 두 개의 문단으로 내용을 나누었어요. 더 나눌수도 있나요?';
        break;
      case 3:
        message = '문단을 적절히 나누고 있어요. 각 문단의 내용이 서로 달라야 해요.';
        break;
      case 4:
      case 5:
        message = '문단 구분이 잘 되어있어요. 각 문단이 자연스럽게 이어지나요?';
        break;
      default:
        message = '문단이 너무 많아요. 비슷한 내용은 한 문단으로 모아보세요.';
    }

    setParagraphAnalysis(message);
  };

  // 분석하기 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (!essayData.title || !essayData.content) {
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
        body: JSON.stringify(essayData),
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
              value={essayData[field]}
              onChange={handleChange}
            />
          ))}
        </div>

        <input
          type="text"
          id="title"
          placeholder="제목"
          className="border p-2 sm:p-3 rounded w-full mb-4 text-lg"
          value={essayData.title}
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

          {/* 문단 컨트롤 버튼 */}
          <div className="paragraph-controls">
            <button className="paragraph-button suggestion-button" onClick={() => {}}>
              <span>문단 제안하기</span>
              <span className="button-icon">💡</span>
            </button>
            <button className="paragraph-button preview-button" onClick={() => {}}>
              <span>문단 미리보기</span>
              <span className="button-icon">👁️</span>
            </button>
          </div>

          <div id="previewContent" className="preview-content hidden"></div>

          <textarea
            id="content"
            placeholder="이곳에 글을 작성하세요.\n문단을 나누고 싶을 때는 Enter키를 한 번 눌러주세요."
            className="border p-2 sm:p-3 rounded w-full h-64 text-lg"
            value={essayData.content}
            onChange={handleChange}
          ></textarea>

          {/* 글쓰기 피드백 */}
          <div className="writing-feedback">
            <div className="char-count">
              <span>글자수: {charCount}자</span>
            </div>
            <div className="paragraph-count">
              <span>문단수: {paragraphCount}개</span>
            </div>
            <div className="paragraph-analysis">
              <span>{paragraphAnalysis}</span>
            </div>
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
          {/* 분석 결과 템플릿 */}
          <div dangerouslySetInnerHTML={{ __html: analysisResult }} />
        </div>
      )}
    </div>
  );
}
