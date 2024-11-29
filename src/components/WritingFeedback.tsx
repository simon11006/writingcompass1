'use client'

import { useEffect, useState } from 'react';

interface WritingFeedbackProps {
  content: string;
}

interface FeedbackState {
  charCount: number;
  paragraphCount: number;
  analysis: string;
}

export default function WritingFeedback({ content }: WritingFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackState>({
    charCount: 0,
    paragraphCount: 0,
    analysis: ''
  });

  useEffect(() => {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    const charCount = content.replace(/\n/g, '').length;
    
    let analysisMessage = '글쓰기를 시작해보세요.';
    if (charCount > 0) {
      if (paragraphs.length === 1 && charCount > 200) {
        analysisMessage = '문단을 나누면 글이 더 읽기 쉬워져요.';
      } else if (paragraphs.length >= 2) {
        analysisMessage = '문단 구성이 잘 되어있어요!';
      }
    }

    setFeedback({
      charCount,
      paragraphCount: paragraphs.length,
      analysis: analysisMessage
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
