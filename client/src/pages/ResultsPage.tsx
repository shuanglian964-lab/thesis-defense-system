import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotateCcw, Home, BookOpen, Check } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import ScoreRing from '../components/ScoreRing';
import FeedbackCard from '../components/FeedbackCard';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { historyId } = useParams<{ historyId?: string }>();
  const { summary, questions, reset, sessionId, history, saveToHistory, paperAnalysis } = useSession();
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const didSave = useRef(false);

  // Load from history if viewing a past session
  const record = historyId ? history.find((r) => r.id === historyId) : undefined;

  // Auto-save current session to history (only once)
  useEffect(() => {
    if (!historyId && summary && sessionId && !didSave.current) {
      didSave.current = true;
      // Check if already in history
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

  const handleRetry = () => {
    reset();
    navigate('/');
  };

  const dimLabels: Record<string, string> = {
    relevance: 'Relevance',
    accuracy: 'Accuracy',
    clarity: 'Clarity',
    completeness: 'Completeness',
    fluency: 'Fluency',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 text-center mb-2">
        Defense Results
      </h1>
      {record && (
        <p className="text-xs text-indigo-400 text-center mb-6">
          {record.topic.slice(0, 60)}... &middot; {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      {/* Saved confirmation */}
      {saved && (
        <div className="flex items-center justify-center gap-2 mb-4 text-emerald-500 text-sm">
          <Check className="w-4 h-4" /> Saved to history!
        </div>
      )}

      {/* Overall Score */}
      <div className="flex flex-col items-center mb-8">
        <ScoreRing score={displaySummary.average_score} label="Average Score" />
      </div>

      {/* Dimension Averages */}
      <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-6 mb-8">
        <h3 className="text-sm font-semibold text-indigo-600 mb-4">Dimension Breakdown</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(dimLabels).map(([key, label]) => {
            const score = displaySummary.dimension_averages[key as keyof typeof displaySummary.dimension_averages] ?? 0;
            const pct = (score / 10) * 100;
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-indigo-400 mb-1">{label}</p>
                <div className="h-2 rounded-full bg-indigo-100/50 overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-lg font-bold text-indigo-700">{score.toFixed(1)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-6 mb-8">
        <h3 className="text-sm font-semibold text-indigo-600 mb-3">Overall Feedback</h3>
        <p className="text-sm text-indigo-800 leading-relaxed">{displaySummary.overall_feedback}</p>
      </div>

      {/* Strengths & Improvements Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {displaySummary.strengths_summary.length > 0 && (
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-emerald-600 mb-2">Key Strengths</h3>
            <ul className="space-y-1">
              {displaySummary.strengths_summary.map((s, i) => (
                <li key={i} className="text-sm text-indigo-700 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {displaySummary.improvements_summary.length > 0 && (
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-amber-600 mb-2">Areas to Improve</h3>
            <ul className="space-y-1">
              {displaySummary.improvements_summary.map((imp, i) => (
                <li key={i} className="text-sm text-indigo-700 flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span> {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Per-Question Details */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-indigo-600 mb-3">Per-Question Detail</h3>
        <div className="space-y-3">
          {displaySummary.per_question.map((fb, i) => {
            const q = displayQuestions.find((q) => q.id === fb.question_id);
            const isExpanded = expandedQ === fb.question_id;
            return (
              <div key={fb.question_id}>
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : fb.question_id)}
                  className="w-full text-left p-4 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-indigo-400">Q{i + 1}</span>
                      <p className="text-sm font-medium text-indigo-800 mt-0.5 line-clamp-1">
                        {q?.question || `Question ${i + 1}`}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">{fb.score.toFixed(1)}</span>
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
      <div className="flex justify-center gap-4">
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 text-indigo-600 font-semibold text-sm shadow-sm hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          New Defense
        </button>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 text-indigo-600 font-semibold text-sm shadow-sm hover:scale-105 transition-transform"
        >
          <BookOpen className="w-4 h-4" />
          View History
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-300/30 hover:scale-105 transition-transform"
        >
          <Home className="w-4 h-4" />
          Go Home
        </button>
      </div>
    </div>
  );
}
