import type { AnalyzeResponse, AnswerFeedback, FinalSummary } from '../types';

const BASE = '/api';

export async function analyzePaper(file: File): Promise<AnalyzeResponse> {
  const form = new FormData();
  form.append('pdf', file);

  const res = await fetch(`${BASE}/papers/analyze`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  transcript: string
): Promise<{ feedback: AnswerFeedback }> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id: questionId, transcript }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Evaluation failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function completeDefense(sessionId: string): Promise<{ summary: FinalSummary }> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/complete`, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Summary failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}
