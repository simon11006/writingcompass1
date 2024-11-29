export function analyzeParagraphs(content: string) {
  // 문단 분리
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
  
  // 각 문단 분석
  const analysis = paragraphs.map((paragraph, index) => {
    // 문장 수 계산
    const sentences = paragraph.match(/[^.!?]+[.!?](?:[\s"']|$)/g) || [];
    const sentenceCount = sentences.length;
    
    // 문단 길이 분석
    let suggestions = [];
    if (sentenceCount > 5) {
      suggestions.push(`이 문단은 ${sentenceCount}개의 문장을 포함하고 있어요. 3-5개의 문장으로 나누면 더 읽기 좋아질 거예요.`);
    } else if (sentenceCount < 2) {
      suggestions.push('이 문단은 너무 짧아요. 다른 문단과 합치거나 내용을 더 추가해보세요.');
    }

    // 시작 문장 분석
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

  return analysis;
}

export function analyzeParagraphFlow(paragraphs: string[]) {
  if (paragraphs.length < 2) {
    return {
      suggestions: ['문단을 더 나눠서 작성하면 글의 구조가 더 명확해질 거예요.'],
      score: 0
    };
  }

  const suggestions = [];
  let score = 100;

  // 도입-본론-결론 구조 확인
  if (paragraphs.length < 3) {
    suggestions.push('도입, 본론, 결론의 구조로 나누어 보면 어떨까요?');
    score -= 20;
  }

  // 각 문단의 길이 균형 확인
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
