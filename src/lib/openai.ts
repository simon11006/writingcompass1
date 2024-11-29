export async function analyzeEssay(content: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `아래 제시된 글을 초등학교 5학년 학생의 수준에서 아주 자세하고 친절하게 분석해주세요:

          ${content}

          다음 형식으로 분석해주세요:

          #전체평가
          총평: [쉽고 자세한 설명으로 300자 이내 평가]

          #평가항목
          [논리성] (30%)
          등급: [A+~F]
          평가: [종합적 평가 내용을 자세하고 쉽게 설명]
          잘된 점: [구체적 예시와 함께 설명]
          개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]`
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('분석 오류:', error);
    throw error;
  }
}
