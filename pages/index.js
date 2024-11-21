import { useState, useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

export default function Home() {
  const [essayData, setEssayData] = useState({
    grade: '',
    class: '',
    number: '',
    name: '',
    title: '',
    content: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 글자 수 및 문단 수 업데이트
  useEffect(() => {
    const totalCount = essayData.content.replace(/\n/g, '').length;
    setCharCount(totalCount);

    const paragraphs = essayData.content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    setParagraphCount(paragraphs.length);
  }, [essayData.content]);

  // 입력 변화 핸들러
  const handleChange = (e) => {
    setEssayData({ ...essayData, [e.target.id]: e.target.value });
  };

  // 분석 요청 핸들러
  const handleSubmit = async () => {
    if (!essayData.title || !essayData.content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ essayData }),
      });

      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setAnalysisResult(data.analysis);
      }
    } catch (error) {
      console.error('분석 오류:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>글쓰기 나침반</title>
      </Head>
      <div className="container">
        {/* 제공하신 HTML 코드를 JSX 문법에 맞게 변환하여 여기에 포함합니다. */}
        {/* 클래스 이름은 그대로 사용하여 CSS가 적용되도록 합니다. */}
        {/* 예를 들어: */}
        <div className="title-container">
          <h1 className="main-title">글쓰기 나침반</h1>
          <p className="subtitle">글쓰기 능력 향상을 위한 맞춤형 분석 도우미</p>
        </div>
        {/* 나머지 HTML 코드도 동일하게 변환하여 포함합니다. */}
        {/* ... */}
      </div>
    </>
  );
}
