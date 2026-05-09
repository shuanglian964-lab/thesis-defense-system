import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-error-50/80 backdrop-blur-sm border border-error/20">
      <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
      <p className="text-sm text-error-700 flex-1">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-error-50 transition-colors">
        <X className="w-4 h-4 text-error" />
      </button>
    </div>
  );
}
