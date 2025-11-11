import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Gemini chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 Gemini received:", message);

    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Please enter a message." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const reply = result.response.text();

    console.log("🤖 Gemini reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ reply: "Error getting reply from Gemini API." });
  }
});

export default router;
