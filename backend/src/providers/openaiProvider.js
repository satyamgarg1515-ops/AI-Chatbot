import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateOpenAIResponse(message, history = []) {
  const messages = history.length
    ? history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    : [{ role: "user", content: message }];

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
