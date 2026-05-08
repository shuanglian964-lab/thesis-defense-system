import { Router, Request, Response, NextFunction } from 'express';
import { upload } from '../middleware/upload.js';
import { extractText } from '../services/pdfParser.js';
import { chat } from '../services/deepseek.js';
import { analyzePaperPrompt } from '../prompts/analyzePaper.js';
import { createSession } from '../services/sessionStore.js';

export const papersRouter = Router();

papersRouter.post(
  '/analyze',
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('pdf')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No PDF file uploaded. Use field name "pdf".' });
        return;
      }

      // 1. Extract text from PDF
      const paperText = await extractText(file.buffer);

      // 2. Call DeepSeek for analysis + question generation + outline
      const messages = analyzePaperPrompt(paperText);
      const result = await chat(messages, { temperature: 0.3, max_tokens: 4096 });

      // 3. Validate and extract
      const paperAnalysis = result.paper_analysis;
      const questions = result.questions;
      const presentationOutline = result.presentation_outline;

      if (!paperAnalysis || !questions || !presentationOutline) {
        res.status(500).json({ error: 'AI response missing required fields.' });
        return;
      }

      if (!Array.isArray(questions) || questions.length < 5) {
        res.status(500).json({ error: 'Generated too few questions. Please try again.' });
        return;
      }

      // 4. Create session
      const session = createSession(paperAnalysis, questions, presentationOutline);

      res.json({
        session_id: session.session_id,
        paper_analysis: paperAnalysis,
        questions,
        presentation_outline: presentationOutline,
      });
    } catch (err) {
      next(err);
    }
  }
);
