import { AnswerFeedback, DimensionScores, PaperAnalysis } from '../services/sessionStore.js';

export function summarizeDefensePrompt(
  answers: AnswerFeedback[],
  paperAnalysis: PaperAnalysis
): { role: string; content: string }[] {
  const answersSummary = answers
    .map(
      (a, i) =>
        `Q${i + 1}: score=${a.score}, relevance=${a.dimension_scores.relevance}, accuracy=${a.dimension_scores.accuracy}, clarity=${a.dimension_scores.clarity}, completeness=${a.dimension_scores.completeness}, fluency=${a.dimension_scores.fluency}`
    )
    .join('\n');

  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const avgScore = answers.length > 0 ? totalScore / answers.length : 0;

  return [
    {
      role: 'system',
      content: `You are an expert thesis defense coach providing a final performance summary. Synthesize the per-question scores into an overall assessment with actionable recommendations. Output must be valid JSON. The word "json" is required for your response format.`,
    },
    {
      role: 'user',
      content: `Generate a final defense summary based on the student's performance. Return ONLY valid JSON (no markdown, no code fences).

PAPER TOPIC: ${paperAnalysis.topic}
TOTAL QUESTIONS: ${answers.length}
RAW TOTAL SCORE: ${totalScore.toFixed(1)}

PER-QUESTION SCORES:
${answersSummary}

JSON STRUCTURE:
{
  "overall_feedback": "string (3-5 sentence paragraph summarizing overall performance, highlighting key patterns)",
  "strengths_summary": ["string (3 recurring strengths across the defense)"],
  "improvements_summary": ["string (3 key areas to focus on before the real defense)"]
}`,
    },
  ];
}

export function computeDimensionAverages(answers: AnswerFeedback[]): DimensionScores {
  if (answers.length === 0) {
    return { relevance: 0, accuracy: 0, clarity: 0, completeness: 0, fluency: 0 };
  }
  const keys: (keyof DimensionScores)[] = ['relevance', 'accuracy', 'clarity', 'completeness', 'fluency'];
  const result: any = {};
  for (const key of keys) {
    const sum = answers.reduce((acc, a) => acc + a.dimension_scores[key], 0);
    result[key] = Math.round((sum / answers.length) * 10) / 10;
  }
  return result as DimensionScores;
}
