import { v4 as uuidv4 } from 'uuid';

export interface PaperAnalysis {
  topic: string;
  method: string;
  conclusion: string;
  contributions: string;
  limitations: string;
  key_points: string[];
}

export interface QuestionItem {
  id: string;
  type: 'basic' | 'deep' | 'tricky';
  question: string;
  reference_answer: string;
}

export interface OutlineSection {
  title: string;
  duration_minutes: number;
  key_points: string[];
}

export interface PresentationOutline {
  title: string;
  sections: OutlineSection[];
  estimated_duration_minutes: number;
}

export interface DimensionScores {
  relevance: number;
  accuracy: number;
  clarity: number;
  completeness: number;
  fluency: number;
}

export interface AnswerFeedback {
  question_id: string;
  transcript: string;
  score: number;
  dimension_scores: DimensionScores;
  strengths: string[];
  improvements: string[];
  reference_answer: string;
}

export interface DefenseSession {
  session_id: string;
  paper_analysis: PaperAnalysis;
  questions: QuestionItem[];
  presentation_outline: PresentationOutline;
  current_index: number;
  answers: AnswerFeedback[];
  status: 'preparing' | 'in_progress' | 'completed';
  created_at: string;
}

export interface FinalSummary {
  total_score: number;
  average_score: number;
  dimension_averages: DimensionScores;
  per_question: AnswerFeedback[];
  overall_feedback: string;
  strengths_summary: string[];
  improvements_summary: string[];
}

const store = new Map<string, DefenseSession>();

export function createSession(
  paperAnalysis: PaperAnalysis,
  questions: QuestionItem[],
  presentationOutline: PresentationOutline
): DefenseSession {
  const session: DefenseSession = {
    session_id: uuidv4(),
    paper_analysis: paperAnalysis,
    questions,
    presentation_outline: presentationOutline,
    current_index: 0,
    answers: [],
    status: 'preparing',
    created_at: new Date().toISOString(),
  };
  store.set(session.session_id, session);
  return session;
}

export function getSession(id: string): DefenseSession | undefined {
  return store.get(id);
}

export function updateSession(id: string, updates: Partial<DefenseSession>): boolean {
  const session = store.get(id);
  if (!session) return false;
  Object.assign(session, updates);
  return true;
}

// Auto-cleanup sessions older than 2 hours
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, session] of store) {
    if (new Date(session.created_at).getTime() < cutoff) {
      store.delete(id);
    }
  }
}, 30 * 60 * 1000);
