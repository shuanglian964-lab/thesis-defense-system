import { useState, useEffect } from 'react';

export default function HeroIllustration() {
  const [typingText, setTypingText] = useState('');
  const fullText = 'Good morning.\nYour thesis is analyzed.\n7 defense questions ready.\nShall we begin?';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypingText(fullText.slice(0, i));
        i++;
      }
    }, 65);
    return () => clearInterval(timer);
  }, []);

  const lines = typingText.split('\n');
  const lastLine = lines[lines.length - 1] || '';

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 420 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-800 ease-out transform -rotate-y-[8deg] -translate-y-1 hover:rotate-y-[4deg] hover:translate-y-0"
      >
        {/* Background shelf */}
        <rect x="60" y="310" width="300" height="14" rx="7" fill="var(--color-neutral-200)" opacity="0.6" />

        {/* Podium body */}
        <path
          d="M100 320 L100 260 Q100 245 115 245 L305 245 Q320 245 320 260 L320 320 Z"
          fill="var(--color-neutral-100)"
          stroke="var(--color-neutral-300)"
          strokeWidth="2"
        />
        {/* Podium top face */}
        <path
          d="M100 260 Q100 245 115 245 L305 245 Q320 245 320 260 L300 250 L120 250 Z"
          fill="var(--color-surface-raised)"
          stroke="var(--color-neutral-300)"
          strokeWidth="1.5"
        />
        {/* Podium front panel detail */}
        <rect x="180" y="265" width="60" height="3" rx="1.5" fill="var(--color-accent-400)" opacity="0.6" />
        <rect x="185" y="275" width="50" height="2" rx="1" fill="var(--color-neutral-300)" opacity="0.4" />
        <rect x="185" y="280" width="40" height="2" rx="1" fill="var(--color-neutral-300)" opacity="0.3" />

        {/* Graduation Cap */}
        <g transform="translate(210, 150)">
          <path
            d="M-50 0 L0 -18 L50 0 L0 18 Z"
            fill="var(--color-neutral-800)"
            stroke="var(--color-neutral-900)"
            strokeWidth="1.5"
          />
          <path
            d="M-50 0 L0 -18 L50 0 L0 4 Z"
            fill="var(--color-neutral-700)"
            opacity="0.6"
          />
          {/* Tassel */}
          <path
            d="M48 -2 Q60 -10 55 -25"
            stroke="var(--color-accent)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="55" cy="-26" r="3.5" fill="var(--color-accent)" />
          {/* Cap button */}
          <circle cx="0" cy="1" r="3" fill="var(--color-accent)" />
          {/* Skull band */}
          <rect x="-30" y="16" width="60" height="8" rx="4" fill="var(--color-neutral-900)" opacity="0.8" />
        </g>

        {/* Monitor on podium */}
        <g transform="translate(140, 198)">
          <rect x="0" y="0" width="140" height="90" rx="8" fill="var(--color-surface-raised)" stroke="var(--color-neutral-300)" strokeWidth="2" />
          <rect x="8" y="8" width="124" height="70" rx="4" fill="var(--color-neutral-900)" />
          {typingText.split('\n').map((line, i) => (
            <text
              key={i}
              x="14"
              y={22 + i * 14}
              fill="var(--color-accent)"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9"
            >
              {line}
            </text>
          ))}
          {/* Blinking cursor */}
          <rect
            x={14 + lastLine.length * 5.5}
            y={22 + (lines.length - 1) * 14 - 8}
            width="5"
            height="10"
            fill="var(--color-accent)"
            className="animate-blink"
          />
        </g>

        {/* Star badge sticker */}
        <g transform="translate(85, 200)">
          <circle cx="0" cy="0" r="12" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="12" fill="var(--color-accent)">&#9733;</text>
        </g>

        {/* "AI READY" label */}
        <g transform="translate(345, 215)">
          <rect x="-22" y="-8" width="44" height="16" rx="3" fill="var(--color-accent)" opacity="0.85" />
          <text x="0" y="3" textAnchor="middle" fontSize="7" fontFamily="'JetBrains Mono', monospace" fill="white" fontWeight="600">AI READY</text>
        </g>

        {/* Rainbow accent ribbon */}
        <g transform="translate(355, 265)">
          <rect x="0" y="0" width="4" height="18" rx="2" fill="var(--color-error)" opacity="0.6" />
          <rect x="5" y="0" width="4" height="18" rx="2" fill="var(--color-warning)" opacity="0.6" />
          <rect x="10" y="0" width="4" height="18" rx="2" fill="var(--color-success)" opacity="0.6" />
          <rect x="15" y="0" width="4" height="18" rx="2" fill="var(--color-info)" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
