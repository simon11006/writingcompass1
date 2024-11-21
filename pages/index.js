// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import '../styles/style.css'; // 추가된 CSS 파일
import '../styles/globals.css'; // Tailwind CSS

export default function Home() {
  // 상태 관리
  const [essayData, setEssayData] = useState({
    grade: '',
    class: '',
    number: '',
    name: '',
    title: '',
    content: '',
  });

  const [charCount, setCharCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [paragraphAnalysis, setParagraphAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // 글자 수 및 문단 수 계산
  useEffect(() => {
    const content = essayData.content;
    setCharCount(countCharacters(content));
    const paragraphs = content.split(/\n+/).filter((p) => p.trim());
    setParagraphCount(paragraphs.length);
    updateParagraphAnalysis(paragraphs);
  }, [essayData.content]);

  // 글자 수 세기 함수
  function countCharacters(text) {
    if (!text) return 0;
    return text.replace(/\n/g, '').length;
  }

  // 문단 분석 업데이트 함수
  function updateParagraphAnalysis(paragraphs) {
    const count = paragraphs.length;
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
  }

  // 입력 필드 변경 처리
  function handleChange(e) {
    const { id, value } = e.target;
    setEssayData({ ...essayData, [id]: value });
  }

  // 분석하기 버튼 클릭
  async function handleSubmit() {
    const { title, content } = essayData;

    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

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
      setAnalysisResult(data.result);
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  // 문단 미리보기 토글
  function toggleParagraphPreview() {
    const content = essayData.content;

    if (!content.trim()) {
      alert('미리보기할 내용을 먼저 작성해주세요.');
      return;
    }

    setShowPreview(!showPreview);

    if (!showPreview) {
      const paragraphs = content.split('\n').filter((p) => p.trim());
      const previewHTML = paragraphs.map((para, idx) => (
        <div key={idx} className="preview-paragraph">
          <div className="preview-paragraph-header">{idx + 1}번째 문단</div>
          <div className="preview-paragraph-content">{para}</div>
        </div>
      ));
      setPreviewContent(previewHTML);
    } else {
      setPreviewContent('');
    }
  }

  // 모달 관련 상태 및 함수 (팁 모달)
  const [showTipModal, setShowTipModal] = useState(false);

  function openTipModal() {
    setShowTipModal(true);
  }

  function closeTipModal() {
    setShowTipModal(false);
  }

  return (
    <>
      <Head>
        <title>글쓰기 나침반</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="container">
        {/* 제목 및 입력 폼 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="title-container">
            <h1 className="main-title">글쓰기 나침반</h1>
            <p className="subtitle">글쓰기 능력 향상을 위한 맞춤형 분석 도우미</p>
          </div>
          <div className="input-grid mb-4">
            <input
              type="text"
              id="grade"
              placeholder="학년"
              className="border p-2 sm:p-3 rounded text-lg w-full"
              value={essayData.grade}
              onChange={handleChange}
            />
            <input
              type="text"
              id="class"
              placeholder="반"
              className="border p-2 sm:p-3 rounded text-lg w-full"
              value={essayData.class}
              onChange={handleChange}
            />
            <input
              type="text"
              id="number"
              placeholder="번호"
              className="border p-2 sm:p-3 rounded text-lg w-full"
              value={essayData.number}
              onChange={handleChange}
            />
            <input
              type="text"
              id="name"
              placeholder="이름"
              className="border p-2 sm:p-3 rounded text-lg w-full"
              value={essayData.name}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            id="title"
            placeholder="제목"
            className="border p-2 sm:p-3 rounded w-full mb-4 text-lg"
            value={essayData.title}
            onChange={handleChange}
          />
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
              <button
                className="paragraph-button preview-button"
                onClick={toggleParagraphPreview}
              >
                <span>{showPreview ? '미리보기 닫기' : '문단 미리보기'}</span>
                <span className="button-icon">👁️</span>
              </button>
              <button
                className="paragraph-button suggestion-button"
                onClick={openTipModal}
              >
                <span>문단 나누기 팁</span>
                <span className="button-icon">💡</span>
              </button>
            </div>

            {/* 미리보기 내용 */}
            {showPreview && (
              <div id="previewContent" className="preview-content">
                {previewContent}
              </div>
            )}

            {/* 모달 창 */}
            {showTipModal && (
              <>
                <div className="modal-overlay" onClick={closeTipModal}></div>
                <div className="tip-modal">
                  <h3 className="text-xl font-bold mb-4">문단 나누기 Tips!</h3>
                  <ul className="space-y-2">
                    <li>✍️ 하나의 문단에는 하나의 중심 생각만 담아요.</li>
                    <li>✍️ 새로운 내용이 시작되면 새로운 문단으로 나눠요.</li>
                    <li>✍️ 문단의 첫 문장에 중심 내용을 담아요.</li>
                    <li>✍️ 보통 3~5문장이 한 문단이 되어요.</li>
                    <li>✍️ 들여쓰기로 문단의 시작을 표시해요.</li>
                  </ul>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={closeTipModal}
                  >
                    알겠어요!
                  </button>
                </div>
              </>
            )}

            <div className="text-area-wrapper">
              <textarea
                id="content"
                placeholder={`이곳에 글을 작성하세요.\n문단을 나누고 싶을 때는 Enter키를 한 번 눌러주세요.`}
                className="border p-2 sm:p-3 rounded w-full h-64 text-lg"
                value={essayData.content}
                onChange={handleChange}
              ></textarea>
            </div>

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
            id="submitBtn"
            className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-lg font-medium hover:bg-blue-600 w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '분석중...' : '분석하기'}
          </button>
        </div>

        {/* 분석 결과 표시 */}
        {analysisResult && (
          <div id="result" className="analysis-container">
            <div dangerouslySetInnerHTML={{ __html: analysisResult }}></div>
            <div className="print-button-container no-print">
              <button
                onClick={() => window.print()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                프린트하기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
