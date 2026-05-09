import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ message = 'Processing...', submessage }: Props) {
  return (
    <div className="flex items-center gap-4 py-8">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 animate-pulse"
        style={{ background: '#f5ecd7', border: '1px solid rgba(184,134,11,0.15)' }}
      >
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#b8860b' }} />
      </div>
      <div>
        <p className="font-semibold text-base" style={{ color: '#1e293b' }}>{message}</p>
        {submessage && <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>{submessage}</p>}
      </div>
    </div>
  );
}
