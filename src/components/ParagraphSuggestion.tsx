'use client'

interface ParagraphSuggestionProps {
  content: string;
  visible: boolean;
  onClose: () => void;
}

export default function ParagraphSuggestion({ content, visible, onClose }: ParagraphSuggestionProps) {
  if (!visible) return null;

  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());

  return (
    <div className="preview-content">
      <div className="preview-paragraphs">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="preview-paragraph">
            <div className="preview-paragraph-header">
              {index + 1}번째 문단
            </div>
            <div className="preview-paragraph-content">
              {paragraph}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
      >
        닫기
      </button>
    </div>
  );
}
