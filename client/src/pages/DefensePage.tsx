import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '../context/SessionContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useApi } from '../hooks/useApi';
import { submitAnswer, completeDefense } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import MicButton from '../components/MicButton';
import FeedbackCard from '../components/FeedbackCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import type { AnswerFeedback } from '../types';

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function DefensePage() {
  const navigate = useNavigate();
  const {
    sessionId,
    questions,
    currentIndex,
    addAnswer,
    nextQuestion,
    setSummary,
    setError: setCtxError,
    error: ctxError,
  } = useSession();

  const { isListening, transcript, interimTranscript, start, stop, isSupported: sttSupported } =
    useSpeechRecognition();
  const { speak, cancel, isSupported: ttsSupported } = useSpeechSynthesis();

  const [phase, setPhase] = useState<'ai-speaking' | 'listening' | 'evaluating' | 'feedback' | 'completed-all'>(
    'ai-speaking'
  );
  const [currentFeedback, setCurrentFeedback] = useState<AnswerFeedback | null>(null);

  const { loading: evaluating, execute: execSubmit } = useApi(submitAnswer);
  const { loading: summarizing, execute: execComplete } = useApi(completeDefense);

  const currentQuestion = questions[currentIndex];

  // Redirect if no session
  useEffect(() => {
    if (!sessionId || questions.length === 0) navigate('/');
  }, [sessionId, questions, navigate]);

  // AI speaks the question when entering a new question
  useEffect(() => {
    if (!currentQuestion || phase !== 'ai-speaking') return;
    const timer = setTimeout(() => {
      speak(currentQuestion.question, () => {
        setPhase('listening');
      });
    }, 500);
    return () => {
      clearTimeout(timer);
      cancel();
    };
  }, [currentQuestion, currentIndex, phase]);

  const handleMicStart = useCallback(() => {
    if (phase !== 'listening') return;
    start();
  }, [phase, start]);

  const handleMicStop = useCallback(async () => {
    if (phase !== 'listening') return;
    const finalTranscript = stop();
    if (finalTranscript.length < 2) return;

    setPhase('evaluating');
    if (!sessionId || !currentQuestion) return;

    const result = await execSubmit(sessionId, currentQuestion.id, finalTranscript);
    if (result) {
      setCurrentFeedback(result.feedback);
      addAnswer(result.feedback);
      setPhase('feedback');
    } else {
      setPhase('listening');
    }
  }, [phase, stop, sessionId, currentQuestion, execSubmit, addAnswer]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setPhase('completed-all');
    } else {
      setCurrentFeedback(null);
      nextQuestion();
      setPhase('ai-speaking');
    }
  }, [currentIndex, questions.length, nextQuestion]);

  const handleComplete = useCallback(async () => {
    if (!sessionId) return;
    const result = await execComplete(sessionId);
    if (result) {
      setSummary(result.summary);
      navigate('/results');
    }
  }, [sessionId, execComplete, setSummary, navigate]);

  if (!currentQuestion) return null;

  const isLastQuestion = currentIndex + 1 >= questions.length;

  const typeBadge = (type: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      basic: { bg: 'bg-tag-emerald-soft', text: 'text-tag-emerald' },
      deep: { bg: 'bg-tag-purple-soft', text: 'text-tag-purple' },
      tricky: { bg: 'bg-tag-amber-soft', text: 'text-tag-amber' },
    };
    const cfg = map[type] ?? map.basic;
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
        {type === 'basic' ? 'Basic' : type === 'deep' ? 'Deep Analysis' : 'Tricky'}
      </span>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 sm:py-14">
      <div className="space-y-6">
        {/* Progress */}
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        {/* Question card */}
        <motion.div
          key={currentQuestion.id + '-q'}
          {...fadeUp}
          className="surface-raised p-6"
        >
          <div className="mb-3">{typeBadge(currentQuestion.type)}</div>
          <h2 className="heading-3 text-neutral-800">{currentQuestion.question}</h2>
          {phase === 'listening' && (
            <p className="mt-3 text-xs text-accent animate-pulse">Speak your answer now...</p>
          )}
        </motion.div>

        {ctxError && (
          <ErrorBanner message={ctxError} onDismiss={() => setCtxError(null)} />
        )}

        {/* Dynamic phase area */}
        <AnimatePresence mode="wait">
          {phase === 'completed-all' ? (
            <motion.div key="completed" {...fadeUp} className="surface-raised p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="heading-2 mb-2">All Questions Completed!</h2>
              <p className="body-base text-neutral-500">
                You answered all {questions.length} questions. Click below to see your results.
              </p>
              <button
                onClick={handleComplete}
                disabled={summarizing}
                className="btn-primary mt-6"
              >
                {summarizing ? 'Generating Summary...' : 'View My Results'}
              </button>
            </motion.div>
          ) : evaluating ? (
            <motion.div key="evaluating" {...fadeUp}>
              <LoadingSpinner message="Evaluating your answer..." submessage="AI is analyzing your response" />
            </motion.div>
          ) : currentFeedback && phase === 'feedback' ? (
            <motion.div key="feedback" {...fadeUp} className="space-y-4">
              <FeedbackCard feedback={currentFeedback} />
              <div className="flex justify-end">
                <button
                  onClick={isLastQuestion ? handleComplete : handleNext}
                  disabled={summarizing}
                  className="btn-primary"
                >
                  {isLastQuestion
                    ? summarizing
                      ? 'Generating...'
                      : 'Finish & View Results'
                    : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="mic" {...fadeUp} className="surface-card p-8 flex flex-col items-center justify-center gap-6 min-h-[300px]">
              <p className="text-sm text-neutral-500 text-center">
                {phase === 'ai-speaking'
                  ? 'AI is speaking the question...'
                  : 'Hold the microphone button and speak your answer in English'}
              </p>
              <MicButton
                isListening={isListening}
                onStart={handleMicStart}
                onStop={handleMicStop}
                disabled={phase !== 'listening'}
              />
              {transcript && (
                <div className="w-full p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <p className="text-xs text-neutral-400 mb-1">Your transcript</p>
                  <p className="text-sm text-neutral-700">
                    {transcript}
                    {interimTranscript && (
                      <span className="text-neutral-400 italic"> {interimTranscript}</span>
                    )}
                  </p>
                </div>
              )}
              {!sttSupported && (
                <p className="text-xs text-warning">
                  Speech recognition is not supported in this browser. Please use Chrome.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
