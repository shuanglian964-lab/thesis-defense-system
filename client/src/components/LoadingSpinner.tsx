import { Loader2 } from 'lucide-react';

interface Props {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ message = 'Processing...', submessage }: Props) {
  return (
    <div className="flex items-center gap-4 py-8">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 animate-pulse bg-accent-50 border border-accent/15">
        <Loader2 className="w-7 h-7 animate-spin text-accent" />
      </div>
      <div>
        <p className="font-semibold text-base text-neutral-900">{message}</p>
        {submessage && <p className="text-sm mt-0.5 text-neutral-400">{submessage}</p>}
      </div>
    </div>
  );
}
