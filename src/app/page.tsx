'use client'

import { useState } from 'react'
import AnalysisResult from '@/components/AnalysisResult'
import ParagraphSuggestion from '@/components/ParagraphSuggestion'
import TipModal from '@/components/TipModal'
import WritingFeedback from '@/components/WritingFeedback'

export default function Home() {
  // 상태 관리
  const [content, setContent] = useState('')
  const [grade, setGrade] = useState('')
  const [className, setClassName] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // 분석 요청 처리
  const handleAnalysis = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'user',
            content: `아래 제시된 글을 초등학교 5학년 학생의 수준에서 아주 자세하고 친절하게 분석해주세요:

            ${content}

            다음 형식으로 분석해주세요:

            #전체평가
            총평: [쉽고 자세한 설명으로 300자 이내 평가]

            #평가항목
            [논리성] (30%)
            등급: [A+~F]
            평가: [종합적 평가 내용을 자세하고 쉽게 설명]
            잘된 점: [구체적 예시와 함께 설명]
            개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      setShowAnalysis(true);
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }

  return (
    <main className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 no-print">
        <div className="title-container">
          <h1 className="main-title">글쓰기 나침반</h1>
          <p className="subtitle">글쓰기 능력 향상을 위한 맞춤형 분석 도우미</p>
        </div>

        <div className="input-grid mb-4">
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="학년"
            className="border p-2 sm:p-3 rounded text-lg w-full"
          />
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="반"
            className="border p-2 sm:p-3 rounded text-lg w-full"
          />
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="번호"
            className="border p-2 sm:p-3 rounded text-lg w-full"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="border p-2 sm:p-3 rounded text-lg w-full"
          />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="border p-2 sm:p-3 rounded w-full mb-4 text-lg"
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
              className="paragraph-button suggestion-button"
              onClick={() => setShowSuggestion(true)}
            >
              <span>문단 제안하기</span>
              <span className="button-icon">💡</span>
            </button>
            <button
              className="paragraph-button preview-button"
              onClick={() => setShowPreview(!showPreview)}
            >
              <span>{showPreview ? '미리보기 닫기' : '문단 미리보기'}</span>
              <span className="button-icon">{showPreview ? '✕' : '👁️'}</span>
            </button>
          </div>

          {/* 미리보기 영역 */}
          {showPreview && <div id="previewContent" className="preview-content">
            <ParagraphSuggestion
              content={content}
              visible={showPreview}
              onClose={() => setShowPreview(false)}
            />
          </div>}

          {/* 분석 결과 표시 영역 */}
          <div id="analysisResult" className={`analysis-container ${!showAnalysis ? 'hidden' : ''}`}>
            <AnalysisResult
              essayData={{
                grade,
                class: className,
                number,
                name,
                title,
                content
              }}
              visible={showAnalysis}
            />
          </div>

          <div className="text-area-wrapper">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이곳에 글을 작성하세요. 
문단을 나누고 싶을 때는 Enter키를 한 번 눌러주세요."
              className="border p-2 sm:p-3 rounded w-full h-64 text-lg"
            />
            <div className="paragraph-suggestions"></div>
          </div>

          {/* 실시간 피드백 */}
          <WritingFeedback content={content} />
        </div>

        <button
          onClick={handleAnalysis}
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-lg font-medium hover:bg-blue-600 w-full sm:w-auto"
        >
          분석하기
        </button>
      </div>

      {/* 팁 모달 */}
      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
      />
    </main>
  );
}
