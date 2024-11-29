'use client'

interface WritingFeedbackProps {
  content: string;
}

export default function WritingFeedback({ content }: WritingFeedbackProps) {
  const charCount = content.replace(/\n/g, '').length;
  const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim()).length;

  return (
    <div className="writing-feedback">
      <div className="char-count">
        <span>글자수: {charCount}자</span>
      </div>
      <div className="paragraph-count">
        <span>문단수: {paragraphCount}개</span>
      </div>
      <div className="paragraph-analysis">
        <span>{charCount > 0 ? '문단을 나누면 글이 더 읽기 쉬워져요.' : '글쓰기를 시작해보세요.'}</span>
      </div>
    </div>
  );
}
