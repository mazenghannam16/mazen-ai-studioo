import { GoogleGenAI, Type } from "@google/genai";
import { PromptResult } from "../types";

const SYSTEM_INSTRUCTION = `
You are an expert AI Prompt Engineer and Image Analyzer. Your goal is to reverse-engineer images. 
When given an image, you must analyze it in extreme detail (composition, lighting, style, subject, camera angle, color palette, artistic medium) 
and generate a precise text prompt that could be used in a text-to-image model (like Midjourney, Stable Diffusion, or Gemini) to recreate this exact image.

You must provide two versions of this prompt:
1. A professional English prompt.
2. A professional Arabic prompt (translated and culturally adapted if necessary to convey the same artistic style).

Return ONLY the JSON object.
`;

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<PromptResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this image and generate the prompts as per system instructions.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: {
              type: Type.STRING,
              description: "The detailed image generation prompt in English.",
            },
            arabic: {
              type: Type.STRING,
              description: "The detailed image generation prompt in Arabic.",
            },
          },
          required: ["english", "arabic"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from the model.");
    }

    return JSON.parse(text) as PromptResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// Helper to convert File to Base64 (stripped)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/png;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to fetch image from URL and convert to Base64
export const urlToBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image from URL");
    
    const blob = await response.blob();
    const mimeType = blob.type;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve({ base64, mimeType });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error("Could not load image from URL. It might be blocked by CORS. Please download the image and upload it manually.");
  }
};