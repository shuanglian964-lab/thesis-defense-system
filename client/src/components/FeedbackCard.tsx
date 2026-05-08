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
    <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
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

      <div className="p-5 space-y-4">
        {feedback.strengths.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
            </p>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-sm text-indigo-700 pl-5 relative before:content-['·'] before:absolute before:left-2 before:text-emerald-400">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.improvements.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-600 flex items-center gap-1 mb-2">
              <Lightbulb className="w-3.5 h-3.5" /> Areas to Improve
            </p>
            <ul className="space-y-1">
              {feedback.improvements.map((imp, i) => (
                <li key={i} className="text-sm text-indigo-700 pl-5 relative before:content-['·'] before:absolute before:left-2 before:text-amber-400">
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.reference_answer && (
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100/50">
            <p className="text-xs font-semibold text-indigo-500 mb-1">Model Answer</p>
            <p className="text-sm text-indigo-800 leading-relaxed">{feedback.reference_answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
