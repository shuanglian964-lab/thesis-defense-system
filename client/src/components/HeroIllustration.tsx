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

  return (
    <div className="illustration-container" style={{ perspective: '800px' }}>
      {/* Podium / Desk */}
      <svg
        viewBox="0 0 420 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="illustration-svg"
        style={{
          transform: 'rotateY(-8deg) translateY(-4px)',
          transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotateY(4deg) translateY(0px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateY(-8deg) translateY(-4px)';
        }}
      >
        {/* Background shelf */}
        <rect x="60" y="310" width="300" height="14" rx="7" fill="#d4c9a8" opacity="0.5" />

        {/* Podium body */}
        <path
          d="M100 320 L100 260 Q100 245 115 245 L305 245 Q320 245 320 260 L320 320 Z"
          fill="#e8e0cc"
          stroke="#d0c5a5"
          strokeWidth="2"
        />
        {/* Podium top face */}
        <path
          d="M100 260 Q100 245 115 245 L305 245 Q320 245 320 260 L300 250 L120 250 Z"
          fill="#f0e8d5"
          stroke="#d0c5a5"
          strokeWidth="1.5"
        />
        {/* Podium front panel detail */}
        <rect x="180" y="265" width="60" height="3" rx="1.5" fill="#c9a84c" opacity="0.6" />
        <rect x="185" y="275" width="50" height="2" rx="1" fill="#d0c5a5" opacity="0.4" />
        <rect x="185" y="280" width="40" height="2" rx="1" fill="#d0c5a5" opacity="0.3" />

        {/* Graduation Cap */}
        <g transform="translate(210, 150)">
          {/* Cap board (mortarboard) */}
          <path
            d="M-50 0 L0 -18 L50 0 L0 18 Z"
            fill="#2d4a6e"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Cap top face highlight */}
          <path
            d="M-50 0 L0 -18 L50 0 L0 4 Z"
            fill="#3b5998"
            opacity="0.6"
          />
          {/* Tassel */}
          <path
            d="M48 -2 Q60 -10 55 -25"
            stroke="#c9a84c"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="55" cy="-26" r="3.5" fill="#c9a84c" />
          {/* Cap button */}
          <circle cx="0" cy="1" r="3" fill="#c9a84c" />
          {/* Skull band */}
          <rect x="-30" y="16" width="60" height="8" rx="4" fill="#1e293b" opacity="0.8" />
        </g>

        {/* Small screen / monitor on podium */}
        <g transform="translate(140, 198)">
          <rect x="0" y="0" width="140" height="90" rx="8" fill="#fdfcfa" stroke="#d0c5a5" strokeWidth="2" />
          {/* Screen inner */}
          <rect x="8" y="8" width="124" height="70" rx="4" fill="#1e293b" />
          {/* Screen content: typing text */}
          {typingText.split('\n').map((line, i) => (
            <text
              key={i}
              x="14"
              y={22 + i * 14}
              fill="#c9a84c"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9"
              className="typing-line"
            >
              {line}
            </text>
          ))}
          {/* Blinking cursor */}
          <rect
            x={14 + typingText.split('\n').pop()!.length * 5.5}
            y={22 + (typingText.split('\n').length - 1) * 14 - 8}
            width="5"
            height="10"
            fill="#c9a84c"
            style={{ animation: 'blink 0.55s step-end infinite' }}
          />
        </g>

        {/* Decorative stickers (like Fig Mint's) */}
        {/* Sticker 1: Star badge */}
        <g transform="translate(85, 200)">
          <circle cx="0" cy="0" r="12" fill="#faf8f5" stroke="#c9a84c" strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#c9a84c">&#9733;</text>
        </g>

        {/* Sticker 2: "AI READY" label */}
        <g transform="translate(345, 215)">
          <rect x="-22" y="-8" width="44" height="16" rx="3" fill="#c9a84c" opacity="0.85" />
          <text x="0" y="3" textAnchor="middle" fontSize="7" fontFamily="'JetBrains Mono', monospace" fill="#faf8f5" fontWeight="600">AI READY</text>
        </g>

        {/* Sticker 3: Rainbow accent ribbon */}
        <g transform="translate(355, 265)">
          <rect x="0" y="0" width="4" height="18" rx="2" fill="#ef4444" opacity="0.6" />
          <rect x="5" y="0" width="4" height="18" rx="2" fill="#f59e0b" opacity="0.6" />
          <rect x="10" y="0" width="4" height="18" rx="2" fill="#10b981" opacity="0.6" />
          <rect x="15" y="0" width="4" height="18" rx="2" fill="#3b82f6" opacity="0.6" />
        </g>
      </svg>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
