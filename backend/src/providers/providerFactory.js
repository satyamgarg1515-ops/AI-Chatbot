import { generateGeminiResponse } from "./geminiProvider.js";
import { generateOpenAIResponse } from "./openaiProvider.js";

export async function generateAIResponse(provider, message, history) {
  if (provider === "gemini") {
    return await generateGeminiResponse(message, history);
  } else if (provider === "openai") {
    return await generateOpenAIResponse(message, history);
  } else {
    throw new Error("Unsupported AI provider");
  }
}
