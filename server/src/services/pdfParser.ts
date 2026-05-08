import pdfParse from 'pdf-parse';

export async function extractText(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer, { max: 0 });
  let text = data.text;

  // Clean up excessive whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  if (!text || text.length < 100) {
    throw new Error('PDF text extraction failed: the file may be a scanned document or contain insufficient text.');
  }

  // Truncation strategy for long papers: keep first 12000 + last 3000 chars
  const MAX_LENGTH = 15000;
  if (text.length > MAX_LENGTH) {
    const head = text.slice(0, 12000);
    const tail = text.slice(-3000);
    text = head + '\n\n[...content truncated for processing...]\n\n' + tail;
  }

  return text;
}
