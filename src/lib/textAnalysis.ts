export function countCharacters(text: string): number {
  if (!text) return 0;
  return text.replace(/\n/g, '').length;
}

export function countSentences(text: string): number {
  if (!text) return 0;
  const normalized = text.replace(/\n/g, ' ');
  const matches = normalized.match(/[^.!?]+[.!?](?:[\s"']|$)/g) || [];
  return matches.filter(sentence => 
    sentence.trim().replace(/[.!?]/g, '').trim().length > 0
  ).length;
}

export function countParagraphs(text: string): number {
  if (!text) return 0;
  return text.split(/\n\s*\n/).filter(p => p.trim()).length;
}

export function calculateAvgSentenceLength(text: string): number {
  const charCount = countCharacters(text);
  const sentenceCount = countSentences(text);
  return sentenceCount ? Math.round(charCount / sentenceCount) : 0;
}

export function analyzeParagraphStructure(text: string) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const analysis = {
    totalParagraphs: paragraphs.length,
    needsImprovement: false,
    suggestions: [] as string[]
  };

  paragraphs.forEach((para, index) => {
    const sentences = para.match(/[^.!?]+[.!?](?:[\s"']|$)/g) || [];
    if (sentences.length > 5) {
      analysis.needsImprovement = true;
      analysis.suggestions.push(
        `${index + 1}번째 문단이 너무 깁니다. ${sentences.length}개의 문장을 2개의 문단으로 나누는 것이 좋겠어요.`
      );
    }
    if (sentences.length < 2) {
      analysis.needsImprovement = true;
      analysis.suggestions.push(
        `${index + 1}번째 문단이 너무 짧습니다. 다른 문단과 합치거나 내용을 더 추가해보세요.`
      );
    }
  });

  return analysis;
}
