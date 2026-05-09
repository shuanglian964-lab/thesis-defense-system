import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, BarChart3, Calendar, Star, FileText } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { ScoreMiniRing } from '../components/ScoreRing';

const listContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, deleteFromHistory, clearHistory } = useSession();

  if (history.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="surface-card p-12">
          <FileText className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
          <h2 className="heading-3 mb-2">No Practice History Yet</h2>
          <p className="body-base text-neutral-500 mb-6">
            Complete your first defense session and it will appear here.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Start New Defense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="heading-2">Practice History</h1>
          <p className="text-sm text-neutral-500 mt-1">{history.length} session{history.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => { if (confirm('Delete all history?')) clearHistory(); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error-50 text-error text-xs font-semibold hover:bg-error-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Records list */}
      <motion.div className="space-y-4" variants={listContainer} initial="hidden" animate="show">
        {history.map((record) => (
          <motion.div
            key={record.id}
            variants={listItem}
            className="surface-card p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2 mb-2">{record.topic}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>{record.answered_count}/{record.question_count} questions</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning" />
                    {record.average_score.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <ScoreMiniRing score={record.average_score} />
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => navigate(`/results/${record.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-semibold hover:bg-neutral-200 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this record?')) deleteFromHistory(record.id); }}
                    className="px-3 py-1.5 rounded-lg bg-error-50 text-error text-xs hover:bg-error-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Compare CTA */}
      {history.length >= 2 && (
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/compare')} className="btn-primary">
            <BarChart3 className="w-4 h-4" />
            Compare Sessions
          </button>
        </div>
      )}
    </div>
  );
}
