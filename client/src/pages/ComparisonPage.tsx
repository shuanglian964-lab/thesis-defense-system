import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, ArrowRight } from 'lucide-react';
import { useSession } from '../context/SessionContext';

const dimLabels: Record<string, string> = {
  relevance: 'Relevance',
  accuracy: 'Accuracy',
  clarity: 'Clarity',
  completeness: 'Completeness',
  fluency: 'Fluency',
};

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { history } = useSession();

  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');

  const recordA = history.find((r) => r.id === selectedA);
  const recordB = history.find((r) => r.id === selectedB);

  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (history.length < 2) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <p className="body-base text-neutral-500">
          At least 2 sessions are needed to compare. Complete more defenses first.
        </p>
        <button onClick={() => navigate('/history')} className="btn-primary mt-4">
          Back to History
        </button>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const selectClass =
    'w-full rounded-xl bg-white border border-neutral-200 px-4 py-2.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      <h1 className="heading-2 mb-1">Session Comparison</h1>
      <p className="body-base text-neutral-500 mb-8">Select two sessions to compare side-by-side</p>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="label block mb-2">Session A</label>
          <select value={selectedA} onChange={(e) => setSelectedA(e.target.value)} className={selectClass}>
            <option value="">-- Select --</option>
            {sortedHistory.map((r) => (
              <option key={r.id} value={r.id} disabled={r.id === selectedB}>
                {formatDate(r.date)} — {r.topic.slice(0, 50)}... ({r.average_score.toFixed(1)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label block mb-2">Session B</label>
          <select value={selectedB} onChange={(e) => setSelectedB(e.target.value)} className={selectClass}>
            <option value="">-- Select --</option>
            {sortedHistory.map((r) => (
              <option key={r.id} value={r.id} disabled={r.id === selectedA}>
                {formatDate(r.date)} — {r.topic.slice(0, 50)}... ({r.average_score.toFixed(1)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison View */}
      {recordA && recordB && (
        <div className="space-y-6">
          {/* Overall Score Comparison */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center surface-card p-6">
              <p className="text-xs text-neutral-400 mb-1">{formatDate(recordA.date)}</p>
              <p className="text-4xl font-extrabold text-neutral-800">{recordA.average_score.toFixed(1)}</p>
              <p className="text-xs text-neutral-400 mt-1">
                {recordA.answered_count} Q &middot; {recordA.total_score.toFixed(1)} total
              </p>
            </div>

            <div className="text-center">
              {recordB.average_score > recordA.average_score ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-success-50 text-success text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +{(recordB.average_score - recordA.average_score).toFixed(1)}
                </div>
              ) : recordB.average_score < recordA.average_score ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-error-50 text-error text-sm font-semibold">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                  {(recordB.average_score - recordA.average_score).toFixed(1)}
                </div>
              ) : (
                <span className="text-sm text-neutral-400 font-semibold">—</span>
              )}
              <p className="text-xs text-neutral-300 mt-1">change</p>
            </div>

            <div className="text-center surface-card p-6">
              <p className="text-xs text-neutral-400 mb-1">{formatDate(recordB.date)}</p>
              <p className="text-4xl font-extrabold text-neutral-800">{recordB.average_score.toFixed(1)}</p>
              <p className="text-xs text-neutral-400 mt-1">
                {recordB.answered_count} Q &middot; {recordB.total_score.toFixed(1)} total
              </p>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div className="surface-card p-6">
            <h3 className="label mb-4">Dimension Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(dimLabels).map(([key, label]) => {
                const valA = recordA.dimension_averages[key as keyof typeof recordA.dimension_averages] ?? 0;
                const valB = recordB.dimension_averages[key as keyof typeof recordB.dimension_averages] ?? 0;
                const diff = valB - valA;
                const barA = (valA / 10) * 100;
                const barB = (valB / 10) * 100;

                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-neutral-600">{label}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-neutral-400">A: {valA.toFixed(1)}</span>
                        <span className="text-neutral-400">B: {valB.toFixed(1)}</span>
                        {diff !== 0 && (
                          <span className={`font-semibold ${diff > 0 ? 'text-success' : 'text-error'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden mb-0.5">
                      <motion.div
                        className="h-full rounded-full bg-accent/60 flex items-center"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(barA, 1)}%` }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <span className="text-[8px] text-white px-1.5 leading-none">A</span>
                      </motion.div>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent flex items-center"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(barB, 1)}%` }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <span className="text-[8px] text-white px-1.5 leading-none">B</span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="surface-card p-5">
              <p className="text-xs text-neutral-400 mb-1">Session A Topic</p>
              <p className="text-sm text-neutral-700 line-clamp-2">{recordA.topic}</p>
              <p className="text-xs text-neutral-400 mt-2">Questions answered: {recordA.answered_count}/{recordA.question_count}</p>
            </div>
            <div className="surface-card p-5">
              <p className="text-xs text-neutral-400 mb-1">Session B Topic</p>
              <p className="text-sm text-neutral-700 line-clamp-2">{recordB.topic}</p>
              <p className="text-xs text-neutral-400 mt-2">Questions answered: {recordB.answered_count}/{recordB.question_count}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
