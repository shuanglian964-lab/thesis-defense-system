import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

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
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ─────── LEFT COLUMN ─────── */}
          <div className="flex flex-col justify-center pt-4 lg:pt-0">
            {/* Label chip */}
            <p className="caption mb-4">AI-Powered Defense Practice</p>

            {/* Hero heading */}
            <h1 className="heading-1 mb-6">
              Practice your thesis defense{' '}
              <span className="text-accent italic">with an AI</span>
              <br />
              <span className="font-italic">that knows your paper</span>
            </h1>

            {/* Subtitle */}
            <p className="body-large mb-8 max-w-lg">
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

            {/* 3-Step Process Cards */}
            <motion.div
              className="mt-12 space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  variants={item}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:translate-x-1
                    ${i === 0 ? 'bg-surface-raised shadow-sm' : ''}`}
                >
                  <span className="text-xl font-bold shrink-0 w-10 text-right font-heading text-accent">
                    {step.num}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold mb-0.5 text-neutral-800">
                      {step.title}
                    </h4>
                    <p className="body-base text-neutral-500">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* History link */}
            {history.length > 0 && (
              <button
                onClick={() => navigate('/history')}
                className="btn-ghost mt-8 text-sm"
              >
                <BookOpen className="w-4 h-4" />
                View practice history ({history.length} session{history.length !== 1 ? 's' : ''})
              </button>
            )}

            {/* Decorative accent line */}
            <div className="accent-line mt-8" />
          </div>

          {/* ─────── RIGHT COLUMN ─────── */}
          <div className="flex items-center justify-center lg:order-2">
            <div className="relative w-full max-w-[420px] rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-accent-50/50 via-surface-raised/30 to-neutral-100/20 border border-neutral-200/50 shadow-md">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
