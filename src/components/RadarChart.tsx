'use client'

interface RadarChartProps {
  categories: Array<{
    name: string;
    grade: string;
  }>;
}

export default function RadarChart({ categories }: RadarChartProps) {
  const size = 550;
  const center = size / 2;
  const radius = size * 0.35;
  const pointCount = categories.length;
  const angleStep = (Math.PI * 2) / pointCount;

  const convertGradeToValue = (grade: string) => {
    const gradeValues: { [key: string]: number } = {
      'A+': 1.0, 'A': 0.9,
      'B+': 0.8, 'B': 0.7,
      'C+': 0.6, 'C': 0.5,
      'D+': 0.4, 'D': 0.3,
      'F': 0.2
    };
    return gradeValues[grade] || 0.2;
  };

  const points = categories.map((cat, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = convertGradeToValue(cat.grade);
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return { x, y };
  });

  const pathData = points.map((p, i) => 
    (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`
  ).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart">
      {[0.2, 0.4, 0.6, 0.8, 1].map(r => (
        <circle 
          key={r}
          cx={center} 
          cy={center} 
          r={radius * r} 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="2"
        />
      ))}

      {categories.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line 
            key={i}
            x1={center} 
            y1={center} 
            x2={center + radius * Math.cos(angle)} 
            y2={center + radius * Math.sin(angle)} 
            stroke="#e5e7eb" 
            strokeWidth="2"
          />
        );
      })}

      <path 
        d={pathData} 
        fill="rgba(147, 197, 253, 0.3)" 
        stroke="#3b82f6" 
        strokeWidth="3"
      />

      {categories.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + (radius + 50) * Math.cos(angle);
        const y = center + (radius + 50) * Math.sin(angle);
        return (
          <text 
            key={i}
            x={x} 
            y={y} 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={{
              fontSize: '22px',
              fontWeight: 600
            }}
          >
            {cat.name}
          </text>
        );
      })}
    </svg>
  );
}
