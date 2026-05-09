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
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="heading-2">Preparation</h1>
          <p className="body-base mt-1 text-neutral-500">
            Review your questions and presentation outline before starting
          </p>
        </div>
        <button onClick={handleStart} className="btn-primary">
          <Play className="w-4 h-4" />
          Start Voice Defense
        </button>
      </div>

      {/* Paper analysis summary */}
      <div className="surface-card p-6 mb-8">
        <h3 className="label mb-3">Paper Analysis Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-neutral-400">Topic</span>
            <p className="text-neutral-700 font-medium">{paperAnalysis.topic}</p>
          </div>
          <div>
            <span className="text-xs text-neutral-400">Method</span>
            <p className="text-neutral-700 font-medium">{paperAnalysis.method}</p>
          </div>
          <div>
            <span className="text-xs text-neutral-400">Conclusion</span>
            <p className="text-neutral-700 font-medium">{paperAnalysis.conclusion}</p>
          </div>
          <div>
            <span className="text-xs text-neutral-400">Contributions</span>
            <p className="text-neutral-700 font-medium">{paperAnalysis.contributions}</p>
          </div>
        </div>
      </div>

      {/* Questions + Outline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          <h3 className="label ml-1">Defense Questions ({questions.length})</h3>
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
