import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  PaperAnalysis,
  QuestionItem,
  PresentationOutline,
  AnswerFeedback,
  FinalSummary,
  SessionStatus,
} from '../types';

interface SessionState {
  sessionId: string | null;
  status: SessionStatus;
  paperAnalysis: PaperAnalysis | null;
  questions: QuestionItem[];
  outline: PresentationOutline | null;
  currentIndex: number;
  answers: AnswerFeedback[];
  summary: FinalSummary | null;
  error: string | null;
}

interface SessionActions {
  setAnalysis: (sessionId: string, analysis: PaperAnalysis, questions: QuestionItem[], outline: PresentationOutline) => void;
  setStatus: (status: SessionStatus) => void;
  addAnswer: (feedback: AnswerFeedback) => void;
  nextQuestion: () => void;
  setSummary: (summary: FinalSummary) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type SessionContextType = SessionState & SessionActions;

const initialState: SessionState = {
  sessionId: null,
  status: 'idle',
  paperAnalysis: null,
  questions: [],
  outline: null,
  currentIndex: 0,
  answers: [],
  summary: null,
  error: null,
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);

  const setAnalysis = useCallback(
    (sessionId: string, analysis: PaperAnalysis, questions: QuestionItem[], outline: PresentationOutline) => {
      setState((prev) => ({
        ...prev,
        sessionId,
        paperAnalysis: analysis,
        questions,
        outline,
        status: 'preparing' as SessionStatus,
        error: null,
      }));
    },
    []
  );

  const setStatus = useCallback((status: SessionStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const addAnswer = useCallback((feedback: AnswerFeedback) => {
    setState((prev) => ({
      ...prev,
      answers: [...prev.answers, feedback],
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  }, []);

  const setSummary = useCallback((summary: FinalSummary) => {
    setState((prev) => ({
      ...prev,
      summary,
      status: 'completed',
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        setAnalysis,
        setStatus,
        addAnswer,
        nextQuestion,
        setSummary,
        setError,
        reset,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
