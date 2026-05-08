import { config } from '../config.js';

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
}

export async function chat(messages: { role: string; content: string }[], options: ChatOptions = {}) {
  const body = {
    model: config.deepseekModel,
    messages,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.max_tokens ?? 4096,
    response_format: options.response_format ?? { type: 'json_object' },
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(config.deepseekBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`DeepSeek API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      return parseJSON(content);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error('DeepSeek API call failed');
}

function parseJSON(raw: string): any {
  let cleaned = raw.trim();
  // Strip markdown code fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    // Regex fallback: extract {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(`Failed to parse DeepSeek response as JSON: ${cleaned.slice(0, 200)}`);
  }
}
