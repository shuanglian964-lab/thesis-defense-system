export function analyzePaperPrompt(paperText: string): { role: string; content: string }[] {
  return [
    {
      role: 'system',
      content: `You are an expert academic thesis reviewer preparing a PhD candidate for their English thesis defense. Your task is to analyze the paper and generate defense preparation materials. Output must be valid JSON matching the exact structure specified. The word "json" is required for your response format.

IMPORTANT RULES:
- Generate exactly 7 questions: 2 basic, 3 deep, 2 tricky (total 7)
- All text must be in English
- Reference answers should be 2-4 sentences, substantive and accurate
- Presentation outline must follow the 10-section structure exactly
- Key points arrays should have 3-5 items each`,
    },
    {
      role: 'user',
      content: `Analyze the following English thesis paper and generate defense preparation materials. Return ONLY valid JSON (no markdown, no code fences).

JSON STRUCTURE:
{
  "paper_analysis": {
    "topic": "string (one sentence research topic)",
    "method": "string (research methodology used)",
    "conclusion": "string (main findings/conclusion)",
    "contributions": "string (key contributions to the field)",
    "limitations": "string (identified limitations)",
    "key_points": ["string (3-5 key points from the paper)"]
  },
  "questions": [
    {
      "id": "q1",
      "type": "basic",
      "question": "string (the question text)",
      "reference_answer": "string (2-4 sentence model answer)"
    }
    // ... total 7 questions: 2 basic + 3 deep + 2 tricky
  ],
  "presentation_outline": {
    "title": "string (presentation title)",
    "estimated_duration_minutes": 10,
    "sections": [
      {
        "title": "string (e.g. 'Title and Self-Introduction (1 min)')",
        "duration_minutes": 1,
        "key_points": ["string (3-5 bullet points)"]
      }
      // 10 sections: Title+Intro, Background+Motivation, Problem Statement, Methodology, Experiment/Case Study, Key Results, Contributions, Limitations, Future Work, Closing+Q&A
    ]
  }
}

QUESTION TYPES:
- "basic": Focus on research background, objectives, core methods, experimental results — straightforward recall
- "deep": Focus on method rationale, variable impacts, experimental design reasoning, result interpretation, paper contributions
- "tricky": Focus on limitations, assumptions, generalizability, alternative approaches, edge cases, challenging follow-ups

PAPER TEXT:
${paperText}`,
    },
  ];
}
