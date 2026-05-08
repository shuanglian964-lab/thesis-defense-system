import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
    paperAnalysis,
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

  const hasSpokenRef = useRef(false);
  const currentQuestion = questions[currentIndex];

  // Redirect if no session
  useEffect(() => {
    if (!sessionId || questions.length === 0) navigate('/');
  }, [sessionId, questions, navigate]);

  // AI speaks the question when entering a new question
  useEffect(() => {
    if (!currentQuestion || phase !== 'ai-speaking') return;
    hasSpokenRef.current = false;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[70vh]">
        {/* Left Panel: Progress + Question */}
        <div className="lg:col-span-2 space-y-5">
          <ProgressBar current={currentIndex + 1} total={questions.length} />

          <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-6">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
              {currentQuestion.type === 'basic' ? 'Basic' : currentQuestion.type === 'deep' ? 'Deep Analysis' : 'Tricky'}
            </span>
            <h2 className="mt-3 text-lg sm:text-xl font-bold text-indigo-900 leading-relaxed">
              {currentQuestion.question}
            </h2>
            {phase === 'listening' && (
              <p className="mt-3 text-xs text-indigo-400 animate-pulse">Speak your answer now...</p>
            )}
          </div>

          {ctxError && (
            <ErrorBanner message={ctxError} onDismiss={() => setCtxError(null)} />
          )}
        </div>

        {/* Right Panel: Conversation + Feedback */}
        <div className="lg:col-span-3 space-y-5">
          {phase === 'completed-all' ? (
            <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-indigo-900">All Questions Completed!</h2>
              <p className="text-sm text-indigo-500 mt-2">
                You answered all {questions.length} questions. Click below to see your results.
              </p>
              <button
                onClick={handleComplete}
                disabled={summarizing}
                className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-300/30 hover:scale-105 transition-transform active:scale-95 disabled:opacity-60"
              >
                {summarizing ? 'Generating Summary...' : 'View My Results'}
              </button>
            </div>
          ) : evaluating ? (
            <LoadingSpinner message="Evaluating your answer..." submessage="AI is analyzing your response" />
          ) : currentFeedback && phase === 'feedback' ? (
            <>
              <FeedbackCard feedback={currentFeedback} />
              <div className="flex justify-end">
                <button
                  onClick={isLastQuestion ? handleComplete : handleNext}
                  disabled={summarizing}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-300/30 hover:scale-105 transition-transform active:scale-95 disabled:opacity-60"
                >
                  {isLastQuestion ? (summarizing ? 'Generating...' : 'Finish & View Results') : 'Next Question'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px] gap-6">
              <p className="text-sm text-indigo-400 text-center">
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
                <div className="w-full p-4 rounded-xl bg-indigo-50/60 border border-indigo-100/50">
                  <p className="text-xs text-indigo-400 mb-1">Your transcript</p>
                  <p className="text-sm text-indigo-800">
                    {transcript}
                    {interimTranscript && (
                      <span className="text-indigo-400 italic"> {interimTranscript}</span>
                    )}
                  </p>
                </div>
              )}
              {!sttSupported && (
                <p className="text-xs text-amber-500">
                  Speech recognition is not supported in this browser. Please use Chrome.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
