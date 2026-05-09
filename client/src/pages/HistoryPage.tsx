import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, BarChart3, Calendar, Star, FileText } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, deleteFromHistory, clearHistory } = useSession();

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="rounded-3xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-12">
          <FileText className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-indigo-800 mb-2">No Practice History Yet</h2>
          <p className="text-sm text-indigo-400 mb-6">
            Complete your first defense session and it will appear here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-300/20 hover:scale-105 transition-transform"
          >
            Start New Defense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-600 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900">Practice History</h1>
          <p className="text-sm text-indigo-500 mt-1">{history.length} session{history.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => { if (confirm('Delete all history?')) clearHistory(); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-indigo-800 line-clamp-2 mb-2">{record.topic}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>{record.answered_count}/{record.question_count} questions</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    {record.average_score.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ScoreMiniRing score={record.average_score} />
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => navigate(`/results/${record.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this record?')) deleteFromHistory(record.id); }}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compare CTA */}
      {history.length >= 2 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/compare')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-300/20 hover:scale-105 transition-transform"
          >
            <BarChart3 className="w-4 h-4" />
            Compare Sessions
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreMiniRing({ score }: { score: number }) {
  const color = score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444';
  return (
    <svg width="40" height="40">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#e0e7ff" strokeWidth="4" />
      <circle
        cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 16}
        strokeDashoffset={2 * Math.PI * 16 * (1 - Math.min(score / 10, 1))}
        transform="rotate(-90 20 20)"
      />
      <text x="20" y="21" textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold" fill={color}>
        {score.toFixed(0)}
      </text>
    </svg>
  );
}
