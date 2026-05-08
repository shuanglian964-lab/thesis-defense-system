import { Router, Request, Response, NextFunction } from 'express';
import { chat } from '../services/deepseek.js';
import { evaluateAnswerPrompt } from '../prompts/evaluateAnswer.js';
import { summarizeDefensePrompt, computeDimensionAverages } from '../prompts/summarizeDefense.js';
import { getSession, updateSession, AnswerFeedback } from '../services/sessionStore.js';

export const sessionsRouter = Router();

// GET /api/sessions/:id
sessionsRouter.get('/:id', (req: Request, res: Response) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Session not found.' });
    return;
  }
  res.json({ session });
});

// POST /api/sessions/:id/answers
sessionsRouter.post('/:id/answers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = getSession(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    const { question_id, transcript } = req.body;
    if (!question_id || !transcript || transcript.trim().length < 3) {
      res.status(400).json({ error: 'question_id and transcript (min 3 chars) are required.' });
      return;
    }

    const question = session.questions.find((q) => q.id === question_id);
    if (!question) {
      res.status(400).json({ error: `Question ${question_id} not found in this session.` });
      return;
    }

    // Call DeepSeek for evaluation
    const messages = evaluateAnswerPrompt(
      { id: question.id, type: question.type, question: question.question, reference_answer: question.reference_answer },
      transcript,
      session.paper_analysis
    );
    const result = await chat(messages, { temperature: 0.2, max_tokens: 2048 });

    const feedback: AnswerFeedback = {
      question_id: result.question_id || question_id,
      transcript,
      score: result.score ?? 0,
      dimension_scores: result.dimension_scores ?? { relevance: 0, accuracy: 0, clarity: 0, completeness: 0, fluency: 0 },
      strengths: result.strengths ?? [],
      improvements: result.improvements ?? [],
      reference_answer: result.reference_answer ?? '',
    };

    // Update session
    session.answers.push(feedback);
    session.current_index = session.answers.length;
    if (session.status === 'preparing') {
      session.status = 'in_progress';
    }

    res.json({ feedback });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/complete
sessionsRouter.post('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = getSession(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    if (session.answers.length === 0) {
      res.status(400).json({ error: 'No answers submitted yet.' });
      return;
    }

    // Call DeepSeek for final summary
    const messages = summarizeDefensePrompt(session.answers, session.paper_analysis);
    const result = await chat(messages, { temperature: 0.3, max_tokens: 2048 });

    const dimensionAverages = computeDimensionAverages(session.answers);
    const totalScore = session.answers.reduce((sum, a) => sum + a.score, 0);
    const avgScore = Math.round((totalScore / session.answers.length) * 10) / 10;

    const summary = {
      total_score: Math.round(totalScore * 10) / 10,
      average_score: avgScore,
      dimension_averages: dimensionAverages,
      per_question: session.answers,
      overall_feedback: result.overall_feedback ?? '',
      strengths_summary: result.strengths_summary ?? [],
      improvements_summary: result.improvements_summary ?? [],
    };

    session.status = 'completed';
    updateSession(session.session_id, { status: 'completed' });

    res.json({ summary });
  } catch (err) {
    next(err);
  }
});
