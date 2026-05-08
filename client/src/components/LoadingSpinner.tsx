import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ message = 'Processing...', submessage }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-lg">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      </div>
      <p className="mt-6 font-semibold text-indigo-600 text-lg">{message}</p>
      {submessage && (
        <p className="mt-1 text-sm text-indigo-400">{submessage}</p>
      )}
    </div>
  );
}
