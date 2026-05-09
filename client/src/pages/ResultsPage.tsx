import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotateCcw, Home, BookOpen, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useSession } from '../context/SessionContext';
import ScoreRing from '../components/ScoreRing';
import FeedbackCard from '../components/FeedbackCard';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { historyId } = useParams<{ historyId?: string }>();
  const { summary, questions, reset, sessionId, history, saveToHistory } = useSession();
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const didSave = useRef(false);

  const record = historyId ? history.find((r) => r.id === historyId) : undefined;

  // Auto-save current session to history
  useEffect(() => {
    if (!historyId && summary && sessionId && !didSave.current) {
      didSave.current = true;
      const exists = history.find((r) => r.id === sessionId);
      if (!exists) {
        saveToHistory();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    }
  }, [summary, sessionId, historyId, history, saveToHistory]);

  const displaySummary = record ? record.summary : summary;
  const displayQuestions = record ? record.questions : questions;

  if (!displaySummary) {
    navigate('/');
    return null;
  }

  const dimLabels: Record<string, string> = {
    relevance: 'Relevance',
    accuracy: 'Accuracy',
    clarity: 'Clarity',
    completeness: 'Completeness',
    fluency: 'Fluency',
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
      <h1 className="heading-2 text-center mb-1">Defense Results</h1>
      {record && (
        <p className="text-xs text-neutral-400 text-center mb-8">
          {record.topic.slice(0, 60)}... &middot;{' '}
          {new Date(record.date).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      )}

      {/* Saved confirmation */}
      {saved && (
        <div className="flex items-center justify-center gap-2 mb-4 text-success text-sm">
          <Check className="w-4 h-4" /> Saved to history!
        </div>
      )}

      {/* Overall Score */}
      <div className="flex flex-col items-center mb-10 mt-6">
        <ScoreRing score={displaySummary.average_score} label="Average Score" />
      </div>

      {/* Dimension Breakdown */}
      <div className="surface-card p-6 mb-8">
        <h3 className="label mb-4">Dimension Breakdown</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(dimLabels).map(([key, label]) => {
            const score = displaySummary.dimension_averages[key as keyof typeof displaySummary.dimension_averages] ?? 0;
            const pct = (score / 10) * 100;
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-neutral-400 mb-1">{label}</p>
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden mb-1">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <p className="text-lg font-bold text-neutral-800">{score.toFixed(1)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="surface-card p-6 mb-8">
        <h3 className="label mb-3">Overall Feedback</h3>
        <p className="text-sm text-neutral-700 leading-relaxed">{displaySummary.overall_feedback}</p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {displaySummary.strengths_summary.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-xs font-semibold text-success mb-2">Key Strengths</h3>
            <ul className="space-y-1.5">
              {displaySummary.strengths_summary.map((s, i) => (
                <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                  <span className="text-success mt-0.5 shrink-0">+</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {displaySummary.improvements_summary.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="text-xs font-semibold text-warning mb-2">Areas to Improve</h3>
            <ul className="space-y-1.5">
              {displaySummary.improvements_summary.map((imp, i) => (
                <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                  <span className="text-warning mt-0.5 shrink-0">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Per-Question Detail */}
      <div className="mb-10">
        <h3 className="label mb-3">Per-Question Detail</h3>
        <div className="space-y-3">
          {displaySummary.per_question.map((fb, i) => {
            const q = displayQuestions.find((qu) => qu.id === fb.question_id);
            const isExpanded = expandedQ === fb.question_id;
            return (
              <div key={fb.question_id}>
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : fb.question_id)}
                  className="w-full text-left p-4 surface-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-400">Q{i + 1}</span>
                      <p className="text-sm font-medium text-neutral-800 mt-0.5 line-clamp-1">
                        {q?.question || `Question ${i + 1}`}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-neutral-700">{fb.score.toFixed(1)}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="mt-2 ml-4">
                    <FeedbackCard feedback={fb} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button onClick={() => { reset(); navigate('/'); }} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
          New Defense
        </button>
        <button onClick={() => navigate('/history')} className="btn-secondary">
          <BookOpen className="w-4 h-4" />
          View History
        </button>
        <button onClick={() => navigate('/')} className="btn-primary">
          <Home className="w-4 h-4" />
          Go Home
        </button>
      </div>
    </div>
  );
}
