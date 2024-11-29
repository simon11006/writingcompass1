export interface Category {
  grade: string;
  evaluation: string;
  goodPoints: string;
  improvements: string;
}

export interface AnalysisData {
  totalEvaluation: string;
  scores: {
    논리성: Category;
    구조성: Category;
    표현성: Category;
    완성도: Category;
  };
  paragraphs: Array<{
    index: number;
    content: string;
    analysis: string;
    goodPoints: string;
    improvements: string;
    suggestions: string[];
  }>;
  statistics: {
    charCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgSentenceLength: number;
  };
}

export interface EssayData {
  grade: string;
  class: string;
  number: string;
  name: string;
  title: string;
  content: string;
}
