
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESUME_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "A score from 0 to 100 based on resume quality and impact." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key technical strengths and skills." },
    risk_flags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential red flags like lack of quantified data." },
    role_relevance: { type: Type.STRING, description: "Main domain relevance (e.g., DevOps, Cloud)." },
    experience_level: { type: Type.STRING, description: "Estimated seniority (Junior, Mid, Senior)." }
  },
  required: ["score", "strengths", "risk_flags", "role_relevance", "experience_level"]
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

export const analyzeResume = async (file: File): Promise<ResumeAnalysis> => {
  try {
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || 'application/pdf'
              }
            },
            {
              text: "Analyze this resume and provide a structured JSON scoring. Focus on technical skills, impact, and clarity."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: RESUME_ANALYSIS_SCHEMA,
        systemInstruction: "You are an expert technical recruiter. You score resumes fairly based on real-world hiring standards. If a resume is provided as a document, extract all relevant details yourself."
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as ResumeAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume content.");
  }
};
