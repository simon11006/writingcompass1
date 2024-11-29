'use client'

interface AnalysisResultProps {
  essayData: {
    grade: string;
    class: string;
    number: string;
    name: string;
    title: string;
    content: string;
  };
  visible: boolean;
}

export default function AnalysisResult({ essayData, visible }: AnalysisResultProps) {
  if (!visible) return null;

  const getGradeStyle = (grade: string) => {
    const styles = {
      'A+': 'bg-blue-100 text-blue-800 border-2 border-blue-300',
      'A': 'bg-blue-100 text-blue-800 border-2 border-blue-300',
      'B+': 'bg-green-100 text-green-800 border-2 border-green-300',
      'B': 'bg-green-100 text-green-800 border-2 border-green-300',
      'C+': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
      'C': 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
      'D+': 'bg-orange-100 text-orange-800 border-2 border-orange-300',
      'D': 'bg-orange-100 text-orange-800 border-2 border-orange-300',
      'F': 'bg-red-100 text-red-800 border-2 border-red-300'
    };
    return styles[grade as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-2 border-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6">
      <div className="result-title-container">
        <div className="result-title">글쓰기 평가 결과</div>
        <div className="result-date">{new Date().toLocaleDateString('ko-KR')} 분석</div>
      </div>

      <div className="student-info-grid">
        <div className="student-info-item">학년: {essayData.grade}</div>
        <div className="student-info-item">반: {essayData.class}</div>
        <div className="student-info-item">번호: {essayData.number}</div>
        <div className="student-info-item">이름: {essayData.name}</div>
      </div>

      {/* 점수와 총평 섹션 */}
      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="text-blue-600 text-4xl font-bold">95점</span>
            </div>
          </div>
          <div className="h-20 w-px bg-gray-200 mx-4"></div>
          <p className="text-gray-700 text-lg flex-1">
            문단 구분이 잘 되어있고, 논리적 흐름이 자연스러운 글입니다.
          </p>
        </div>
      </div>

      {/* 프린트 버튼 */}
      <div className="print-button-container no-print">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          프린트하기
        </button>
      </div>
    </div>
  );
}
