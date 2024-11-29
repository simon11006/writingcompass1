'use client'

interface StructureSuggestionProps {
  currentStructure: string[];
  improvedStructure: string[];
  actionPlans: string[];
}

export default function StructureSuggestion({
  currentStructure,
  improvedStructure,
  actionPlans
}: StructureSuggestionProps) {
  return (
    <div className="mt-8">
      <h2 className="section-title">문단 구성 제안</h2>
      <div className="structure-content">
        {/* 현재 문단 구조 */}
        <div className="structure-box">
          <div className="structure-box-title">현재 문단 구조</div>
          <div className="structure-list">
            <ul>
              {currentStructure.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 개선된 문단 구조 제안 */}
        <div className="structure-box">
          <div className="structure-box-title">문단 구성 개선안</div>
          <div className="structure-list">
            <ul>
              {improvedStructure.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 구체적 실행 방안 */}
        <div className="structure-box">
          <div className="structure-box-title">구체적 실행 방안</div>
          <div className="structure-list">
            <ul>
              {actionPlans.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
