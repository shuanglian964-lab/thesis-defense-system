import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface Props {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}

export default function MicButton({ isListening, onStart, onStop, disabled }: Props) {
  const label = disabled
    ? 'Please wait...'
    : isListening
      ? 'Release to stop'
      : 'Hold to speak';

  const labelColor = disabled
    ? 'text-neutral-400'
    : isListening
      ? 'text-accent-600'
      : 'text-accent';

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onMouseDown={onStart}
        onMouseUp={onStop}
        onMouseLeave={() => { if (isListening) onStop(); }}
        onTouchStart={(e) => { e.preventDefault(); onStart(); }}
        onTouchEnd={(e) => { e.preventDefault(); onStop(); }}
        disabled={disabled}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center select-none
          ${disabled
            ? 'bg-neutral-200 cursor-not-allowed'
            : isListening
              ? 'bg-accent-600 shadow-lg shadow-accent/30 scale-110'
              : 'bg-accent shadow-lg shadow-accent/25'}`}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full animate-ping bg-accent/30" />
        )}
        <Mic className="w-10 h-10 text-white relative z-10" />
      </motion.button>
      <p className={`text-xs font-medium ${labelColor}`}>{label}</p>
    </div>
  );
}
