import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err.message);

  if (err.message === 'Only PDF files are accepted') {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err.message.startsWith('File too large')) {
    res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    return;
  }

  res.status(500).json({ error: err.message || 'Internal server error' });
}
