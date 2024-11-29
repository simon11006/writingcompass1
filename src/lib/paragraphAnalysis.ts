interface ParagraphAnalysis {
  index: number;
  content: string;
  sentenceCount: number;
  suggestions: string[];
  needsWork: boolean;
}

interface FlowAnalysis {
  suggestions: string[];
  score: number;
}

export function analyzeParagraphs(content: string): ParagraphAnalysis[] {
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
  
  return paragraphs.map((paragraph, index) => {
    const sentences = paragraph.match(/[^.!?]+[.!?](?:[\s"']|$)/g) || [];
    const sentenceCount = sentences.length;
    
    const suggestions: string[] = [];
    if (sentenceCount > 5) {
      suggestions.push(`이 문단은 ${sentenceCount}개의 문장을 포함하고 있어요. 3-5개의 문장으로 나누면 더 읽기 좋아질 거예요.`);
    } else if (sentenceCount < 2) {
      suggestions.push('이 문단은 너무 짧아요. 다른 문단과 합치거나 내용을 더 추가해보세요.');
    }

    const firstSentence = sentences[0]?.trim();
    if (firstSentence) {
      if (firstSentence.length > 50) {
        suggestions.push('첫 문장이 너무 길어요. 더 간단하게 줄여보면 어떨까요?');
      }
      if (/^그래서|그러나|하지만|따라서/.test(firstSentence)) {
        suggestions.push('문단의 시작을 접속사로 시작하기보다는, 핵심 내용을 먼저 제시해보세요.');
      }
    }

    return {
      index: index + 1,
      content: paragraph,
      sentenceCount,
      suggestions,
      needsWork: suggestions.length > 0
    };
  });
}

export function analyzeParagraphFlow(paragraphs: string[]): FlowAnalysis {
  if (paragraphs.length < 2) {
    return {
      suggestions: ['문단을 더 나눠서 작성하면 글의 구조가 더 명확해질 거예요.'],
      score: 0
    };
  }

  const suggestions: string[] = [];
  let score = 100;

  if (paragraphs.length < 3) {
    suggestions.push('도입, 본론, 결론의 구조로 나누어 보면 어떨까요?');
    score -= 20;
  }

  const avgLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
  paragraphs.forEach((p, i) => {
    if (p.length < avgLength * 0.5) {
      suggestions.push(`${i + 1}번째 문단이 다른 문단들에 비해 너무 짧아요.`);
      score -= 10;
    } else if (p.length > avgLength * 1.5) {
      suggestions.push(`${i + 1}번째 문단이 다른 문단들에 비해 너무 길어요.`);
      score -= 10;
    }
  });

  return {
    suggestions,
    score: Math.max(score, 0)
  };
}
