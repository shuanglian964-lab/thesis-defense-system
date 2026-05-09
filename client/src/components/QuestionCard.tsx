import { ChevronDown } from 'lucide-react';
import type { QuestionItem } from '../types';

interface Props {
  question: QuestionItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const typeConfig: Record<string, { label: string; bg: string; text: string }> = {
  basic: { label: 'Basic', bg: 'bg-tag-emerald-soft', text: 'text-tag-emerald' },
  deep: { label: 'Deep Analysis', bg: 'bg-tag-purple-soft', text: 'text-tag-purple' },
  tricky: { label: 'Tricky', bg: 'bg-tag-amber-soft', text: 'text-tag-amber' },
};

export default function QuestionCard({ question, index, isExpanded, onToggle }: Props) {
  const cfg = typeConfig[question.type] ?? typeConfig.basic;

  return (
    <div
      className="surface-card hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onToggle}
    >
      <div className="p-5 flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-500">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-800 leading-relaxed">{question.question}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      {isExpanded && (
        <div className="px-5 pb-5 pl-[68px]">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 mb-1">Reference Answer</p>
            <p className="text-sm text-neutral-700 leading-relaxed">{question.reference_answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
