import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowRight } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import type { HistoryRecord } from '../types';

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
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-indigo-400 text-sm">At least 2 sessions are needed to compare. Complete more defenses first.</p>
        <button onClick={() => navigate('/history')} className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:scale-105 transition-transform">
          Back to History
        </button>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-600 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-2">Session Comparison</h1>
      <p className="text-sm text-indigo-500 mb-8">Select two sessions to compare side-by-side</p>

      {/* Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-2">Session A</label>
          <select
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
            className="w-full rounded-xl bg-white/55 backdrop-blur-xl border border-white/50 px-4 py-2.5 text-sm text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">-- Select --</option>
            {sortedHistory.map((r) => (
              <option key={r.id} value={r.id} disabled={r.id === selectedB}>
                {formatDate(r.date)} — {r.topic.slice(0, 50)}... ({r.average_score.toFixed(1)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-2">Session B</label>
          <select
            value={selectedB}
            onChange={(e) => setSelectedB(e.target.value)}
            className="w-full rounded-xl bg-white/55 backdrop-blur-xl border border-white/50 px-4 py-2.5 text-sm text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
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
            <div className="text-center p-6 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50">
              <p className="text-xs text-indigo-400 mb-1">{formatDate(recordA.date)}</p>
              <p className="text-4xl font-extrabold text-indigo-700">{recordA.average_score.toFixed(1)}</p>
              <p className="text-xs text-indigo-400 mt-1">{recordA.answered_count} Q &middot; {recordA.total_score.toFixed(1)} total</p>
            </div>

            <div className="text-center">
              {recordB.average_score > recordA.average_score ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +{(recordB.average_score - recordA.average_score).toFixed(1)}
                </div>
              ) : recordB.average_score < recordA.average_score ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-500 text-sm font-semibold">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                  {(recordB.average_score - recordA.average_score).toFixed(1)}
                </div>
              ) : (
                <span className="text-sm text-indigo-400 font-semibold">—</span>
              )}
              <p className="text-xs text-indigo-300 mt-1">change</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50">
              <p className="text-xs text-indigo-400 mb-1">{formatDate(recordB.date)}</p>
              <p className="text-4xl font-extrabold text-indigo-700">{recordB.average_score.toFixed(1)}</p>
              <p className="text-xs text-indigo-400 mt-1">{recordB.answered_count} Q &middot; {recordB.total_score.toFixed(1)} total</p>
            </div>
          </div>

          {/* Dimension-by-dimension comparison */}
          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-indigo-600 mb-4">Dimension Breakdown</h3>
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
                      <span className="text-xs font-semibold text-indigo-600">{label}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-indigo-400">A: {valA.toFixed(1)}</span>
                        <span className="text-indigo-400">B: {valB.toFixed(1)}</span>
                        {diff !== 0 && (
                          <span className={`font-semibold ${diff > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-indigo-100/50">
                      <div
                        className="bg-indigo-400/60 transition-all duration-500"
                        style={{ width: `${Math.max(barA, 1)}%` }}
                      >
                        <span className="text-[8px] text-white px-1">A</span>
                      </div>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-indigo-100/50 mt-0.5">
                      <div
                        className="bg-purple-400/60 transition-all duration-500"
                        style={{ width: `${Math.max(barB, 1)}%` }}
                      >
                        <span className="text-[8px] text-white px-1">B</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5">
              <p className="text-xs text-indigo-400 mb-1">Session A Topic</p>
              <p className="text-sm text-indigo-700 line-clamp-2">{recordA.topic}</p>
              <p className="text-xs text-indigo-400 mt-2">Questions answered: {recordA.answered_count}/{recordA.question_count}</p>
            </div>
            <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5">
              <p className="text-xs text-indigo-400 mb-1">Session B Topic</p>
              <p className="text-sm text-indigo-700 line-clamp-2">{recordB.topic}</p>
              <p className="text-xs text-indigo-400 mt-2">Questions answered: {recordB.answered_count}/{recordB.question_count}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
