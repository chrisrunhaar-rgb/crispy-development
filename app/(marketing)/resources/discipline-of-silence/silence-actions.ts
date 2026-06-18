"use server";

import { GoogleGenAI } from "@google/genai";

interface AssessmentSummary {
  dimension: string;
  selectedOption: string;
}

interface OpenAnswers {
  area: string;
  challenge: string;
  impact: string;
}

export async function generateSilenceAdvice(
  assessmentSummary: AssessmentSummary[],
  openAnswers: OpenAnswers
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const assessmentContext = assessmentSummary
    .map(({ dimension, selectedOption }) => `${dimension}: ${selectedOption}`)
    .join("\n");

  const prompt = `You are a warm, faith-rooted leadership coach. A cross-cultural leader just completed the Discipline of Silence module on crispyleaders.com.

Their self-assessment showed:
${assessmentContext}

They reflected:
- Where they want to grow: "${openAnswers.area || "Not specified"}"
- Biggest challenge: "${openAnswers.challenge || "Not specified"}"
- What would change: "${openAnswers.impact || "Not specified"}"

Write 3-4 sentences of personalized advice and encouragement. Be specific to what they shared. Reference silence as a spiritual discipline. End with a brief faith-rooted blessing. Warm, direct, no em dashes, no generic phrases.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text ?? "Keep pressing in. Silence will reward your faithfulness.";
}
