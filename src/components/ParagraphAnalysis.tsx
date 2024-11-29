'use client'

interface ParagraphAnalysisProps {
  paragraphs: Array<{
    index: number;
    content: string;
    analysis: string;
    goodPoints: string;
    improvements: string;
    suggestions: string[];
  }>;
}

export default function ParagraphAnalysis({ paragraphs }: ParagraphAnalysisProps) {
  return (
    <div className="mt-8">
      <h2 className="section-title">문단별 상세 분석</h2>
      <div className="paragraphs-container">
        {paragraphs.map((paragraph, idx) => (
          <div key={idx} className="paragraph-section mt-8">
            <div className="paragraph-header">
              <h4 className="paragraph-title">{paragraph.index}번째 문단</h4>
            </div>
            <div className="original-text">{paragraph.content}</div>
            <div className="paragraph-analysis-section">
              <div className="analysis-box analysis">
                <div className="analysis-box-header">분석</div>
                <div className="analysis-box-content">{paragraph.analysis}</div>
              </div>
              <div className="analysis-box good-points">
                <div className="analysis-box-header">잘된 점</div>
                <div className="analysis-box-content">{paragraph.goodPoints}</div>
              </div>
              <div className="analysis-box improvements">
                <div className="analysis-box-header">개선점</div>
                <div className="analysis-box-content">{paragraph.improvements}</div>
              </div>
            </div>
            {paragraph.suggestions.length > 0 && (
              <div className="suggestion-box">
                <div className="suggestion-title">수정 제안</div>
                <ul className="suggestion-list">
                  {paragraph.suggestions.map((suggestion, index) => (
                    <li key={index} className="suggestion-item">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
