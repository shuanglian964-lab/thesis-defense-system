import { Mic, MicOff } from 'lucide-react';

interface Props {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}

export default function MicButton({ isListening, onStart, onStop, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onMouseDown={onStart}
        onMouseUp={onStop}
        onMouseLeave={() => { if (isListening) onStop(); }}
        onTouchStart={(e) => { e.preventDefault(); onStart(); }}
        onTouchEnd={(e) => { e.preventDefault(); onStop(); }}
        disabled={disabled}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center transition-all select-none
          ${disabled
            ? 'bg-gray-200 cursor-not-allowed'
            : isListening
              ? 'bg-red-400 shadow-lg shadow-red-300/40 scale-110'
              : 'bg-indigo-500 shadow-lg shadow-indigo-300/40 hover:scale-105 active:scale-95'}
        `}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400/30" />
        )}
        {isListening ? (
          <Mic className="w-10 h-10 text-white relative z-10" />
        ) : (
          <Mic className="w-10 h-10 text-white relative z-10" />
        )}
      </button>
      <p className={`text-xs font-medium ${isListening ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-indigo-500'}`}>
        {disabled ? 'Please wait...' : isListening ? 'Release to stop' : 'Hold to speak'}
      </p>
    </div>
  );
}
