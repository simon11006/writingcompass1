import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 환경 변수로 API 키를 설정합니다.
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { essayData } = req.body;

  // 학생의 글을 문단별로 나누고 번호를 매기는 코드
  const paragraphs = essayData.content.split(/\n+/).filter(p => p.trim());
  const numberedParagraphs = paragraphs.map((p, index) => `[${index + 1}문단]\n${p}`).join('\n\n');

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4', // 사용하시는 모델로 변경하세요.
      messages: [{
        role: 'user',
        content: `아래 제시된 제목과 내용을 초등학교 5학년 학생의 수준에서 아주 자세하고 친절하게 분석해주세요...

        제목: "${essayData.title}"
        내용: "${numberedParagraphs}"

        ...`, // 제공하신 프롬프트 내용을 추가합니다.
      }],
      temperature: 0.25,
      max_tokens: 1000,
    });

    const analysisContent = completion.data.choices[0].message.content;
    res.status(200).json({ analysis: analysisContent });
  } catch (error) {
    console.error('분석 오류:', error);
    res.status(500).json({ error: '분석 중 오류가 발생했습니다.' });
  }
}

