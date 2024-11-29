'use client'

import { useState } from 'react'
import AnalysisResult from '@/components/AnalysisResult'
import ParagraphSuggestion from '@/components/ParagraphSuggestion'
import TipModal from '@/components/TipModal'

export default function Home() {
  const [content, setContent] = useState('')
  const [grade, setGrade] = useState('')
  const [className, setClassName] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [showTipModal, setShowTipModal] = useState(false)

  const handleAnalysis = () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setShowAnalysis(true);
  }

  const countCharacters = (text: string) => {
    if (!text) return 0;
    return text.replace(/\n/g, '').length;
  }

  const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim()).length;
  const charCount = countCharacters(content);

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
              className="paragraph-button"
              onClick={() => setShowSuggestion(true)}
            >
              <span>문단 제안하기</span>
              <span className="button-icon">💡</span>
            </button>
            <button
              className="paragraph-button"
              onClick={() => setShowTipModal(true)}
            >
              <span>문단 팁 보기</span>
              <span className="button-icon">👁️</span>
            </button>
          </div>

          <div className="text-area-wrapper">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이곳에 글을 작성하세요. 
문단을 나누고 싶을 때는 Enter키를 한 번 눌러주세요."
              className="border p-2 sm:p-3 rounded w-full h-64 text-lg"
            />
          </div>

          <div className="writing-feedback">
            <div className="char-count">
              <span>글자수: {charCount}자</span>
            </div>
            <div className="paragraph-count">
              <span>문단수: {paragraphCount}개</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalysis}
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-lg font-medium hover:bg-blue-600 w-full sm:w-auto"
        >
          분석하기
        </button>
      </div>

      {/* 분석 결과 컴포넌트 */}
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

      {/* 문단 제안 컴포넌트 */}
      <ParagraphSuggestion
        content={content}
        visible={showSuggestion}
        onClose={() => setShowSuggestion(false)}
      />

      {/* 팁 모달 */}
      <TipModal
        isOpen={showTipModal}
        onClose={() => setShowTipModal(false)}
      />
    </main>
  )
}
