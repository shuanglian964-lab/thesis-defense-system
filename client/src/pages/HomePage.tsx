import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import HeroIllustration from '../components/HeroIllustration';
import { useSession } from '../context/SessionContext';
import { useApi } from '../hooks/useApi';
import { analyzePaper } from '../services/api';

const steps = [
  { num: '01', title: 'Upload Thesis', desc: 'Drop your English thesis PDF — our AI reads and understands it in seconds.' },
  { num: '02', title: 'Review & Prepare', desc: 'Get 7 defense questions, reference answers, and a 10-minute presentation outline.' },
  { num: '03', title: 'Voice Practice', desc: 'Answer questions aloud. AI listens, scores, and gives instant feedback on 5 dimensions.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { setAnalysis, setStatus, setError, error, history } = useSession();
  const { loading, execute } = useApi(analyzePaper);

  const handleFileSelected = async (file: File) => {
    setStatus('uploading');
    setError(null);
    const result = await execute(file);
    if (result) {
      setAnalysis(result.session_id, result.paper_analysis, result.questions, result.presentation_outline);
      navigate('/prepare');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ─────── LEFT COLUMN ─────── */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0">
            {/* Label chip */}
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: '#b8860b', fontFamily: "'JetBrains Mono', monospace" }}>
              AI-Powered Defense Practice
            </p>

            {/* Hero heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1e293b' }}>
              Practice your thesis defense{' '}
              <span style={{ color: '#b8860b' }}>with an AI</span>
              <br />
              <span style={{ fontStyle: 'italic' }}>that knows your paper</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: '#64748b' }}>
              Upload your English thesis PDF. Our AI reads it, generates defense questions, and coaches you through a realistic voice simulation — complete with scores and feedback.
            </p>

            {/* Upload area or loading */}
            {loading ? (
              <div className="mb-10">
                <LoadingSpinner
                  message="Analyzing your paper..."
                  submessage="Extracting text and generating questions · this may take up to 30 seconds"
                />
              </div>
            ) : (
              <FileUpload onFileSelected={handleFileSelected} isLoading={false} error={error} />
            )}

            {/* ── 3-Step Process Cards (like Fig Mint spec table) ── */}
            <div className="mt-12 space-y-4">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-1"
                  style={{
                    background: i === 0 ? 'rgba(255,255,255,0.6)' : 'transparent',
                    borderBottom: i < steps.length - 1 ? '1px solid #e8e1d5' : 'none',
                  }}
                >
                  <span
                    className="text-xl font-bold shrink-0 w-10 text-right"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#b8860b' }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5" style={{ color: '#1e293b' }}>
                      {step.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* History link */}
            {history.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="inline-flex items-center gap-2 mt-8 text-sm transition-colors hover:underline"
                style={{ color: '#b8860b' }}
              >
                <BookOpen className="w-4 h-4" />
                View practice history ({history.length} session{history.length !== 1 ? 's' : ''})
              </button>
            )}

            {/* Decorative accent line */}
            <div className="mt-8" style={{ width: '40px', height: '3px', background: 'linear-gradient(to right, #b8860b, #c9a84c)', borderRadius: '2px' }} />
          </div>

          {/* ─────── RIGHT COLUMN ─────── */}
          <div className="flex items-center justify-center lg:order-2">
            <div
              className="relative w-full max-w-[420px] rounded-2xl p-6 sm:p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(245,236,215,0.4) 0%, rgba(255,255,255,0.3) 50%, rgba(232,225,213,0.2) 100%)',
                border: '1px solid rgba(200,185,150,0.25)',
                boxShadow: '0 4px 32px rgba(30,41,59,0.04)',
              }}
            >
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
