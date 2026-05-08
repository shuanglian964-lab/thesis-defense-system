import { AlertTriangle, X } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: Props) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50/70 backdrop-blur-sm border border-red-200/50">
      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <p className="text-sm text-red-600 flex-1">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-red-100/50 transition-colors">
        <X className="w-4 h-4 text-red-400" />
      </button>
    </div>
  );
}
