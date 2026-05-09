import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  PaperAnalysis,
  QuestionItem,
  PresentationOutline,
  AnswerFeedback,
  FinalSummary,
  SessionStatus,
  HistoryRecord,
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
  /* history */
  history: HistoryRecord[];
  saveToHistory: () => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

type SessionContextType = SessionState & SessionActions;

const HISTORY_KEY = 'thesis-defense-history';
const SESSION_KEY = 'thesis-defense-session';

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

function loadHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(records: HistoryRecord[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
  } catch {
    // storage full — ignore
  }
}

function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(state: SessionState) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      sessionId: state.sessionId,
      status: state.status,
      paperAnalysis: state.paperAnalysis,
      questions: state.questions,
      outline: state.outline,
      currentIndex: state.currentIndex,
      answers: state.answers,
      summary: state.summary,
      error: state.error,
    }));
  } catch {
    // ignore
  }
}

function clearPersistedSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const saved = loadSession();
  const [state, setState] = useState<SessionState>(saved ?? initialState);
  const [history, setHistory] = useState<HistoryRecord[]>(loadHistory);

  // Auto-persist session on state change
  useEffect(() => {
    if (state.sessionId) persistSession(state);
  }, [state]);

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
    clearPersistedSession();
  }, []);

  // --- History operations ---

  const saveToHistory = useCallback(() => {
    if (!state.summary || !state.paperAnalysis || !state.sessionId) return;
    const record: HistoryRecord = {
      id: state.sessionId,
      session_id: state.sessionId,
      topic: state.paperAnalysis.topic,
      date: new Date().toISOString(),
      question_count: state.questions.length,
      answered_count: state.answers.length,
      total_score: state.summary.total_score,
      average_score: state.summary.average_score,
      dimension_averages: state.summary.dimension_averages,
      summary: state.summary,
      questions: state.questions,
    };
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== record.id);
      const updated = [record, ...filtered].slice(0, 50); // keep last 50
      saveHistory(updated);
      return updated;
    });
  }, [state.summary, state.paperAnalysis, state.sessionId, state.questions, state.answers]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
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
        history,
        saveToHistory,
        deleteFromHistory,
        clearHistory,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be within SessionProvider');
  return ctx;
}
