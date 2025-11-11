import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Loader2, LogOut, Share2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import MessageBubble from "../components/MessageBubble";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [provider, setProvider] = useState("gemini");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);

  // ✅ Load Chat History
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:4000/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data || []))
      .catch(() => toast.error("⚠️ Failed to load chat history."));
  }, [navigate, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMsg = {
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    controllerRef.current = new AbortController();

    try {
      const historyForAI = [...messages, userMsg].map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await axios.post(
        "http://localhost:4000/api/chat",
        { message: userMsg.content, history: historyForAI, provider },
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controllerRef.current.signal,
        }
      );

      const botMsg = {
        role: "bot",
        content: res.data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
      toast.success("Response received");
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "⚠️ Error: failed to get reply.",
            createdAt: new Date().toISOString(),
          },
        ]);
        toast.error("Failed to get reply");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return toast("No message to regenerate.");

    setLoading(true);
    controllerRef.current = new AbortController();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/chat",
        { message: lastUserMessage.content, provider },
        {
          signal: controllerRef.current.signal,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.data.reply, createdAt: new Date().toISOString() },
      ]);
      toast.success("Regenerated");
    } catch {
      toast.error("Failed to regenerate");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await axios.delete("http://localhost:4000/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
      toast.success("Chat cleared");
    } catch {
      toast.error("Failed to clear chat.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("🔗 Chat link copied!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // ✅ Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Auto-expand textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div
      className={`h-screen flex flex-col relative overflow-hidden transition-all duration-500 ${
        darkMode ? "bg-[#0b1120] text-gray-100" : "bg-[#f8f9fb] text-gray-900"
      }`}
    >
      <Toaster position="top-right" />

      {/* Aurora Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.12),transparent_60%)] animate-pulse" />

      {/* Header */}
      <div className="flex-none sticky top-0 z-20 bg-white/10 dark:bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-md">
        <Header
          provider={provider}
          setProvider={setProvider}
          onClear={handleClear}
          onToggleTheme={toggleTheme}
          darkMode={darkMode}
          onLogout={handleLogout}
        />
      </div>

      {/* Chat Body */}
      <main className="flex-1 overflow-y-auto p-6 md:px-12 space-y-5 relative z-10">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble msg={msg} darkMode={darkMode} time={formatTime(msg.createdAt)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-3 text-sm text-gray-400 italic">
            <Loader2 className="animate-spin" size={18} />
            {provider === "gemini" ? "Gemini is thinking…" : "ChatGPT is typing…"}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input + Controls */}
      <footer
        className={`flex-none border-t border-white/10 p-4 md:p-6 ${
          darkMode ? "bg-black/40" : "bg-white/60"
        }`}
      >
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          {/* Glass input area */}
          <div
            className={`flex gap-3 items-end p-3 rounded-3xl backdrop-blur-md ${
              darkMode ? "bg-white/5" : "bg-white/40"
            } shadow-md border border-white/10 transition`}
          >
            {/* ✅ Auto-expand textarea */}
            <textarea
              ref={textareaRef}
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${provider === "gemini" ? "Gemini" : "ChatGPT"} anything...`}
              className={`flex-1 resize-none overflow-hidden rounded-2xl p-3 bg-transparent border-none placeholder-gray-400 focus:ring-0 cursor-text ${
                darkMode ? "text-gray-100" : "text-gray-800"
              }`}
              style={{ maxHeight: "150px" }}
            />

            {!loading ? (
              <>
                <button
                  onClick={handleSend}
                  className="px-5 py-3 rounded-2xl bg-indigo-500/90 hover:bg-indigo-600/90 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send size={16} />
                  <span className="hidden md:inline">Send</span>
                </button>

                <button
                  onClick={handleRegenerate}
                  className="px-5 py-3 rounded-2xl bg-purple-500/80 hover:bg-purple-600/90 text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw size={16} />
                  <span className="hidden md:inline">Regenerate</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => controllerRef.current?.abort?.()}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:opacity-90 text-white flex items-center gap-2 cursor-pointer"
              >
                <Loader2 size={16} className="animate-spin" />
                Stop
              </button>
            )}
          </div>

          {/* Footer Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 select-none">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-gray-600 dark:text-gray-300">Provider:</span>
              <div className="px-3 py-1 rounded-lg bg-indigo-100/70 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-semibold cursor-default">
                {provider === "gemini" ? "Gemini" : "ChatGPT"}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1 rounded-lg backdrop-blur-md bg-white/20 dark:bg-white/10 text-indigo-600 dark:text-indigo-300 font-medium hover:bg-white/30 transition cursor-pointer shadow-sm"
              >
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 rounded-lg backdrop-blur-md bg-white/20 dark:bg-white/10 text-rose-500 dark:text-rose-400 font-medium hover:bg-white/30 transition cursor-pointer shadow-sm"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ Global pointer fix */}
      <style>
        {`
          select, button, [role="button"], .cursor-pointer {
            cursor: pointer !important;
          }
        `}
      </style>
    </div>
  );
}
