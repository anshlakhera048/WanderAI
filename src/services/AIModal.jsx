import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
if (!apiKey) {
  console.error("❌ Missing VITE_GOOGLE_GENAI_API_KEY");
  throw new Error("Missing Google API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// ✅ use latest v1 model
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.0-flash", // faster, supported, and available
  generationConfig,
});

export const chatSession = model.startChat({
  generationConfig,
});
