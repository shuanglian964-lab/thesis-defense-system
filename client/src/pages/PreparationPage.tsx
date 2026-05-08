import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import QuestionCard from '../components/QuestionCard';
import PresentationOutline from '../components/PresentationOutline';

export default function PreparationPage() {
  const navigate = useNavigate();
  const { questions, outline, paperAnalysis, sessionId, setStatus } = useSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!sessionId || !paperAnalysis || !outline) {
    navigate('/');
    return null;
  }

  const handleStart = () => {
    setStatus('in_progress');
    navigate('/defense');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900">Preparation</h1>
          <p className="text-sm text-indigo-500 mt-1">Review your questions and presentation outline before starting</p>
        </div>
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-300/30 hover:scale-105 transition-transform active:scale-95"
        >
          <Play className="w-4 h-4" />
          Start Voice Defense
        </button>
      </div>

      {/* Paper analysis summary */}
      <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-indigo-600 mb-2">Paper Analysis Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-indigo-400">Topic</span>
            <p className="text-indigo-800">{paperAnalysis.topic}</p>
          </div>
          <div>
            <span className="text-xs text-indigo-400">Method</span>
            <p className="text-indigo-800">{paperAnalysis.method}</p>
          </div>
          <div>
            <span className="text-xs text-indigo-400">Conclusion</span>
            <p className="text-indigo-800">{paperAnalysis.conclusion}</p>
          </div>
          <div>
            <span className="text-xs text-indigo-400">Contributions</span>
            <p className="text-indigo-800">{paperAnalysis.contributions}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-semibold text-indigo-600 ml-1">Defense Questions ({questions.length})</h3>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i + 1}
              isExpanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          <PresentationOutline outline={outline} />
        </div>
      </div>
    </div>
  );
}
