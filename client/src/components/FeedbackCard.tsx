import { CheckCircle2, Lightbulb } from 'lucide-react';
import type { AnswerFeedback } from '../types';

interface Props {
  feedback: AnswerFeedback;
}

const dimLabels: Record<string, string> = {
  relevance: 'Relevance',
  accuracy: 'Accuracy',
  clarity: 'Clarity',
  completeness: 'Completeness',
  fluency: 'Fluency',
};

export default function FeedbackCard({ feedback }: Props) {
  return (
    <div className="surface-card overflow-hidden">
      {/* Score header */}
      <div className="p-5 bg-accent text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Your Score</span>
          <span className="text-4xl font-extrabold">{feedback.score.toFixed(1)}</span>
        </div>
        <div className="grid grid-cols-5 gap-2 mt-3">
          {Object.entries(dimLabels).map(([key, label]) => (
            <div key={key} className="text-center">
              <div className="text-xs opacity-80">{label}</div>
              <div className="text-sm font-bold">
                {(feedback.dimension_scores[key as keyof typeof feedback.dimension_scores] ?? 0).toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-4">
        {feedback.strengths.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-success flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
            </p>
            <ul className="space-y-1.5">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-sm text-neutral-700 leading-relaxed flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success/50 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.improvements.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-warning flex items-center gap-1 mb-2">
              <Lightbulb className="w-3.5 h-3.5" /> Areas to Improve
            </p>
            <ul className="space-y-1.5">
              {feedback.improvements.map((imp, i) => (
                <li key={i} className="text-sm text-neutral-700 leading-relaxed flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning/50 shrink-0" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.reference_answer && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 mb-1">Model Answer</p>
            <p className="text-sm text-neutral-700 leading-relaxed">{feedback.reference_answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
