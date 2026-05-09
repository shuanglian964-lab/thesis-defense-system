import { motion } from 'motion/react';

interface Props {
  score: number;
  size?: number;
  label?: string;
}

export default function ScoreRing({ score, size = 140, label = 'Overall Score' }: Props) {
  const strokeW = 8;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / 10, 1);
  const offset = circumference * (1 - pct);
  const fontSize = size < 60 ? '0.75rem' : size < 100 ? '1.125rem' : '1.5rem';

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-neutral-100)"
          strokeWidth={strokeW}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {/* Score */}
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-neutral-900)"
          fontSize={fontSize}
          fontWeight="800"
        >
          {score.toFixed(1)}
        </text>
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-neutral-400)"
          fontSize="0.75rem"
        >
          / 10
        </text>
      </svg>
      {label && <span className="text-sm font-medium text-neutral-500">{label}</span>}
    </div>
  );
}

/** Compact score ring for list items (HistoryPage) */
export function ScoreMiniRing({ score, size = 40 }: { score: number; size?: number }) {
  const strokeW = 4;
  const radius = (size - strokeW) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / 10, 1);
  const offset = circumference * (1 - pct);
  const color =
    score >= 7
      ? 'var(--color-success)'
      : score >= 5
        ? 'var(--color-warning)'
        : 'var(--color-error)';
  const textColor =
    score >= 7
      ? 'var(--color-success)'
      : score >= 5
        ? 'var(--color-warning)'
        : 'var(--color-error)';

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-neutral-100)"
        strokeWidth={strokeW}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeDasharray={circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="0.625rem"
        fontWeight="600"
      >
        {score.toFixed(1)}
      </text>
    </svg>
  );
}
