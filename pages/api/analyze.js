// pages/api/analyze.js
// Next.js에서는 node-fetch를 따로 설치할 필요 없이 fetch를 사용할 수 있습니다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']); // 허용되는 메서드를 명시적으로 설정
    return res.status(405).json({ error: '허용되지 않는 메소드입니다.' });
  }

  const essayData = req.body;

  // 글자 수 계산 함수
  function countCharacters(text) {
    if (!text) return 0;
    return text.replace(/\n/g, '').length;
  }

  // 학생의 글을 문단별로 나누고 번호를 매기는 코드
  const paragraphs = essayData.content.split(/\n+/).filter((p) => p.trim());
  const numberedParagraphs = paragraphs
    .map((p, index) => `[${index + 1}문단]\n${p}`)
    .join('\n\n');

  const charCount = countCharacters(essayData.content);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 환경 변수에서 API 키를 가져옵니다.
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 사용하시는 모델로 변경하세요.
        messages: [
          {
            role: 'user',
            content: `아래 제시된 제목과 내용을 초등학교 5학년 학생의 수준에서 아주 자세하고 친절하게 분석해주세요. 학생이 제안 내용을 보고 쉽게 고칠 수 있도록 제시해주세요. 어려운 단어는 쉽게 풀어서 설명해주고, 구체적인 예시를 들어가며 설명해주세요. 각 문단 분석시 원문은 반드시 해당 문단 전체 내용을 포함해야 합니다. 이 글이 처음 제출된 것이라면 새롭게 평가하고, 수정본이라면 이전 버전과 비교하여 개선된 점을 중심으로 더 높은 점수를 부여해주세요. 특히 제안사항이 잘 반영되었는지 중점적으로 봐주세요.:

제목: "${essayData.title}"
내용: "${numberedParagraphs}"

참고로, 위 내용에서 [n문단]으로 표시된 부분이 학생이 나눈 문단입니다. 이 문단 구분을 그대로 사용하여 분석하고, 문단 구분을 임의로 변경하거나 재해석하지 마세요.

평가 시 참고사항:
- 문단 구분이 없이 작성된 경우, 구조성 점수는 **반드시 D 이하**로 평가할 것**
- 문단 구분이 없는 경우, 완성도 점수도 **최대 C**까지만 부여 가능
- 글이 수정본인 경우, 이전 제안사항이 잘 반영되었다면 점수를 높게 책정
- 문단 구분이 잘 되어 있고 내용이 통일성을 가진다면 완성도 점수를 상향 조정할 것
- 문장이 간결해지고 이해하기 쉬워졌다면 표현성 점수 상향
- 문단 간 연결이 자연스러워졌다면 구조성 점수 상향
- 논리가 더 탄탄해졌다면 논리성 점수 상향
- 전체적인 글의 완성도는 문단 구분 여부(내용에 따라 문단을 구분했는지)를 중요하게 반영할 것

#전체평가
총평: [쉽고 자세한 설명으로 300자 이내 평가]

#평가항목
논리성, 구조성, 표현성, 완성도를 다음 항목에 맞게 자세하게 평가할 것:

[논리성] (30%)
등급: [A+~F]
평가: [종합적 평가 내용을 자세하고 쉽게 설명]
잘된 점: [구체적 예시와 함께 설명]
개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]

[구조성] (25%)
등급: [A+~F]
평가: [종합적 평가 내용을 자세하고 쉽게 설명]
잘된 점: [구체적 예시와 함께 설명]
개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]

[표현성] (25%)
등급: [A+~F]
평가: [종합적 평가 내용을 자세하고 쉽게 설명]
잘된 점: [구체적 예시와 함께 설명]
개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]

[완성도] (20%)
등급: [A+~F]
평가: [종합적 평가 내용을 자세하고 쉽게 설명]
잘된 점: [구체적 예시와 함께 설명]
개선점: [어떻게 하면 더 좋아질수 있는지 구체적으로 설명]

평가 기준:
- 논리성: 주장과 근거의 타당성, 논리적 흐름
- 구조성: 글의 구조와 문단 간 연결성
- 표현성: 어휘와 문장의 표현, 맞춤법
- 완성도: 전체적인 글(제목, 내용)의 완성도와 통일성

#제목 분석
현재 제목: "${essayData.title}"
분석: 제목에 대해 제목과 내용의 연관성 및 명확성을 고려하여 분석할 것.
제안: 제목이 부족한 경우에만 위 분석을 바탕으로 2-3개의 대안 제목을 제시할 것.

#문단분석
사용자가 작성한 각 문단을 하나씩 분석해주세요. 분석, 잘된 점, 개선점을 아주 자세하고 구체적으로 제시해주세요. 각 문단의 분석은 다음 형식을 따릅니다:

[1문단]
원문: [여기에 반드시 원문 전체 포함]
분석:
잘된 점:
개선점:
수정 제안: 문단 내용에서 고쳐야 할 부분과 함께 그에 대한 구체적인 수정 제안을 하고 이유를 알려줄 것. 제안마다 줄을 바꿔서 2가지 이상 제안할 것.

[2문단]
원문: [여기에 반드시 원문 전체 포함]
분석:
잘된 점:
개선점:
수정 제안: 문단 내용에서 고쳐야 할 부분과 함께 그에 대한 구체적인 수정 제안을 하고 이유를 알려줄 것. 제안마다 줄을 바꿔서 2가지 이상 제안할 것.

[이후 작성된 글의 끝까지 모든 문단에 대해 동일한 형식으로 분석 계속]

#문단 구성 제안
현재 문단 구조:
- 현재 글에서 찾을 수 있는 주제들을 나열하고, 비슷한 내용끼리 모아서 설명할 것
- 각 내용이 글의 어느 부분에 있는지 구체적으로 언급할 것
- 실제 글에서 사용된 문장들을 예시로 들면서 설명할 것

문단 구성 개선안:
이 글은 다음과 같이 나누면 좋을 것 같아요:

1. 첫 번째 문단 (도입부)
- 여기에 넣으면 좋을 내용: [글에서 도입부에 어울리는 내용 구체적으로 제시]
- 실제 글에서 이 부분으로 시작하면 좋을 문장: "[학생의 글에서 발췌한 실제 문장]"

2. 두 번째 문단 (중심 내용)
- 여기에 넣으면 좋을 내용: [글에서 핵심 내용 구체적으로 제시]
- 실제 글에서 이 부분에 들어갈 문장들: "[학생의 글에서 발췌한 실제 문장들]"

3. 세 번째 문단 (마무리)
- 여기에 넣으면 좋을 내용: [글에서 마무리에 어울리는 내용 구체적으로 제시]
- 실제 글에서 이 부분으로 마무리하면 좋을 문장: "[학생의 글에서 발췌한 마지막 문장]"

구체적 실행 방안:
* 첫 번째로 이 문장부터 시작해보세요: "[실제 글에서 발췌한 시작 문장]"
* 여기서 문단을 나누면 좋아요: "[문단을 나눌 부분의 실제 문장]"
* 마지막은 이 문장으로 마무리하면 좋아요: "[실제 글에서 발췌한 마지막 문장]"
* 각 문단의 시작에서 한 줄 띄우는 것을 잊지 마세요!

#통계
- 총 글자 수: ${charCount}자
- 총 문장 수: [숫자]개
- 총 문단 수: [숫자]개
- 평균 문장 길이: [숫자]자`,
          },
        ],
        temperature: 0.25,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error('API 요청 실패');
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const analysisContent = data.choices[0].message.content;

      // 분석 결과를 HTML로 변환하는 함수 호출
      const resultHtml = convertAnalysisToHtml(analysisContent, essayData);

      res.status(200).json({ result: resultHtml });
    } else {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('분석 오류:', error);
    res.status(500).json({ error: '분석 중 오류가 발생했습니다.' });
  }
}

// 글자 수 세기 함수
function countCharacters(text) {
  if (!text) return 0;
  return text.replace(/\n/g, '').length;
}

// 분석 결과를 HTML로 변환하는 함수
function convertAnalysisToHtml(analysisContent, essayData) {
  // 분석 내용을 파싱하고 필요한 HTML을 생성하는 로직을 구현합니다.
  // 이 부분은 제공된 HTML 코드의 JavaScript 로직을 참고하여 구현합니다.
  // 여기서는 간단하게 응답 내용을 그대로 출력합니다.
  return `<div>${analysisContent.replace(/\n/g, '<br/>')}</div>`;
}
