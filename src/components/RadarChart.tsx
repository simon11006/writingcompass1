'use client'

import { useState, useEffect } from 'react';
import RadarChart from './RadarChart';
import type { AnalysisData, EssayData } from '@/types/analysis';

interface AnalysisResultProps {
  essayData: EssayData;
  visible: boolean;
}

export default function AnalysisResult({ essayData, visible }: AnalysisResultProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const getGradeStyle = (grade: string) => {
    const styles: { [key: string]: string } = {
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
    return styles[grade] || 'bg-gray-100 text-gray-800 border-2 border-gray-300';
  };

  if (!visible || !analysisData) return null;

  const categories = {
    '논리성': '주장과 근거의 타당성, 논리적 흐름',
    '구조성': '글의 구조와 문단 간 연결성',
    '표현성': '어휘와 문장의 표현, 맞춤법',
    '완성도': '전체적인 글의 완성도와 통일성'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6">
      {/* 제목 섹션 */}
      <div className="result-title-container">
        <div className="result-title">글쓰기 평가 결과</div>
        <div className="result-date">{new Date().toLocaleDateString('ko-KR')} 분석</div>
      </div>

      {/* 학생 정보 */}
      <div className="student-info-grid">
        <div className="student-info-item">
          <span className="student-info-icon text-2xl mr-2">🎓</span>
          <span className="student-info-label font-semibold text-gray-700 mr-1">학년:</span>
          <span className="student-info-value font-medium text-gray-800">{essayData.grade}</span>
        </div>
        <div className="student-info-item">
          <span className="student-info-icon text-2xl mr-2">🏫</span>
          <span className="student-info-label font-semibold text-gray-700 mr-1">반:</span>
          <span className="student-info-value font-medium text-gray-800">{essayData.class}</span>
        </div>
        <div className="student-info-item">
          <span className="student-info-icon text-2xl mr-2">🔢</span>
          <span className="student-info-label font-semibold text-gray-700 mr-1">번호:</span>
          <span className="student-info-value font-medium text-gray-800">{essayData.number}</span>
        </div>
        <div className="student-info-item">
          <span className="student-info-icon text-2xl mr-2">📝</span>
          <span className="student-info-label font-semibold text-gray-700 mr-1">이름:</span>
          <span className="student-info-value font-medium text-gray-800">{essayData.name}</span>
        </div>
      </div>

      {/* 평가 개요 섹션 */}
      <div className="flex flex-col gap-8 p-6">
        {/* 점수와 총평 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center">
              <span className="text-blue-600 text-4xl font-bold">
                {Math.round(
                  Object.values(analysisData.scores).reduce((acc, curr) => {
                    const gradePoints: { [key: string]: number } = {
                      'A+': 100, 'A': 90, 'B+': 85, 'B': 80,
                      'C+': 75, 'C': 70, 'D+': 65, 'D': 60, 'F': 50
                    };
                    return acc + (gradePoints[curr.grade] || 50);
                  }, 0) / 4
                )}점
              </span>
            </div>
          </div>
          <div className="h-20 w-px bg-gray-200 mx-4"></div>
          <p className="text-gray-700 text-lg flex-1">{analysisData.totalEvaluation}</p>
        </div>

        {/* 레이더 차트와 평가 항목 */}
        <div className="flex gap-12">
          <div className="w-[400px] flex-shrink-0">
            <RadarChart
              categories={Object.entries(analysisData.scores).map(([name, data]) => ({
                name,
                grade: data.grade
              }))}
            />
          </div>

          <div className="flex flex-col flex-1 gap-6">
            {/* 평가 항목 그리드 */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(categories).map(([category, description]) => {
                const data = analysisData.scores[category as keyof typeof analysisData.scores];
                return (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-medium text-gray-900">{category}</div>
                      <div className="text-sm text-gray-500">{description}</div>
                    </div>
                    <div className={`grade-badge ${getGradeStyle(data.grade)}`}>
                      {data.grade}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-6 rounded-lg text-center h-28 flex flex-col justify-center">
                <div className="text-base text-gray-500">총 글자 수</div>
                <div className="text-2xl font-bold text-blue-600">{analysisData.statistics.charCount}자</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center h-28 flex flex-col justify-center">
                <div className="text-base text-gray-500">총 문장 수</div>
                <div className="text-2xl font-bold text-blue-600">{analysisData.statistics.sentenceCount}개</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center h-28 flex flex-col justify-center">
                <div className="text-base text-gray-500">총 문단 수</div>
                <div className="text-2xl font-bold text-blue-600">{analysisData.statistics.paragraphCount}개</div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center h-28 flex flex-col justify-center">
                <div className="text-base text-gray-500">평균 문장 길이</div>
                <div className="text-2xl font-bold text-blue-600">{analysisData.statistics.avgSentenceLength}자</div>
              </div>
            </div>
          </div>
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
