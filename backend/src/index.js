// ✅ DNS safety (optional)
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

// ✅ Imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit"; // ✅ Added as instructed
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Basic Rate Limiter (fake for demo but looks real)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10,             // allow only 10 requests per minute
  message: {
    status: 429,
    message: "⏳ Too many requests. Please wait a few seconds before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Apply rate limiter to all routes
app.use(limiter);

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_chatbot";
console.log("🔍 Mongo URI:", mongoURI);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    startServer();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Message Schema (linked to user)
import mongoosePkg from "mongoose";
const messageSchema = new mongoosePkg.Schema(
  {
    userId: { type: mongoosePkg.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "bot"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);
const Message = mongoosePkg.model("Message", messageSchema);

// ✅ Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ✅ JWT Auth Middleware
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found." });
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ✅ Use Auth Routes
app.use("/api/auth", authRoutes);

// ✅ Protected Chat Route (normal message)
app.post("/api/chat", protect, async (req, res) => {
  try {
    const { message, history } = req.body;
    console.log("📩 Gemini received message:", message);

    if (!message?.trim()) return res.status(400).json({ reply: "Please enter a message." });

    await Message.create({ userId: req.user._id, role: "user", content: message });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: history || [{ role: "user", parts: [{ text: message }] }],
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const reply = result.response.text();
    console.log("🤖 Gemini reply:", reply);

    await Message.create({ userId: req.user._id, role: "bot", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    res.status(500).json({ reply: "Error getting reply from Gemini API." });
  }
});

// ✅ New Route: Regenerate Last Bot Reply
app.post("/api/chat/regenerate", protect, async (req, res) => {
  try {
    console.log("🔁 Regenerating last response...");

    // Find the last user message for this user
    const lastUserMessage = await Message.findOne({ userId: req.user._id, role: "user" })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastUserMessage)
      return res.status(404).json({ reply: "No previous message found to regenerate." });

    // Load full recent context (for better coherence)
    const history = await Message.find({ userId: req.user._id }).sort({ createdAt: 1 });
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: formattedHistory,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const newReply = result.response.text();
    console.log("🔁 New Gemini reply:", newReply);

    await Message.create({ userId: req.user._id, role: "bot", content: newReply });

    res.json({ reply: newReply });
  } catch (error) {
    console.error("❌ Regenerate Error:", error);
    res.status(500).json({ reply: "Error regenerating response." });
  }
});

// ✅ Get Chat History (Protected)
app.get("/api/history", protect, async (req, res) => {
  try {
    const chats = await Message.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to load chat history." });
  }
});

// ✅ Delete Chat History (Protected)
app.delete("/api/history", protect, async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.user._id });
    res.json({ message: "Chat history cleared successfully." });6
  } catch (error) {
    console.error("❌ Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear history." });
  }
});

// ✅ Start Server
function startServer() {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
