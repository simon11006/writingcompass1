'use client'

import { useEffect, useState } from 'react';
import { analyzeParagraphs, analyzeParagraphFlow } from '@/lib/paragraphAnalysis';

interface WritingFeedbackProps {
  content: string;
}

export default function WritingFeedback({ content }: WritingFeedbackProps) {
  const [feedback, setFeedback] = useState({
    charCount: 0,
    paragraphCount: 0,
    analysis: '',
  });

  useEffect(() => {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    const charCount = content.replace(/\n/g, '').length;
    
    // 문단 분석
    const paragraphAnalysis = analyzeParagraphs(content);
    const flowAnalysis = analyzeParagraphFlow(paragraphs);
    
    // 피드백 메시지 생성
    let analysisMessage = '글쓰기를 시작해보세요.';
    if (charCount > 0) {
      if (paragraphs.length === 1 && charCount > 200) {
        analysisMessage = '문단을 나누면 글이 더 읽기 쉬워져요.';
      } else if (paragraphs.length >= 2) {
        if (paragraphAnalysis.some(p => p.needsWork)) {
          analysisMessage = '문단을 더 자연스럽게 나눠보면 어떨까요?';
        } else if (flowAnalysis.score >= 80) {
          analysisMessage = '문단 구성이 잘 되어있어요!';
        }
      }
    }

    setFeedback({
      charCount,
      paragraphCount: paragraphs.length,
      analysis: analysisMessage,
    });
  }, [content]);

  return (
    <div className="writing-feedback">
      <div className="char-count">
        <span>글자수: {feedback.charCount}자</span>
      </div>
      <div className="paragraph-count">
        <span>문단수: {feedback.paragraphCount}개</span>
      </div>
      <div className="paragraph-analysis">
        <span>{feedback.analysis}</span>
      </div>
    </div>
  );
}
