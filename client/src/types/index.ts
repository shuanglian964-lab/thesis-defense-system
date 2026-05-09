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

export interface FinalSummary {
  total_score: number;
  average_score: number;
  dimension_averages: DimensionScores;
  per_question: AnswerFeedback[];
  overall_feedback: string;
  strengths_summary: string[];
  improvements_summary: string[];
}

export interface AnalyzeResponse {
  session_id: string;
  paper_analysis: PaperAnalysis;
  questions: QuestionItem[];
  presentation_outline: PresentationOutline;
}

export type SessionStatus = 'idle' | 'uploading' | 'analyzing' | 'preparing' | 'in_progress' | 'completed';

export interface HistoryRecord {
  id: string;
  session_id: string;
  topic: string;
  date: string;
  question_count: number;
  answered_count: number;
  total_score: number;
  average_score: number;
  dimension_averages: DimensionScores;
  summary: FinalSummary;
  questions: QuestionItem[];
}
