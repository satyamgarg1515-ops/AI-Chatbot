import React from "react";
import { Sun, Moon, Trash2 } from "lucide-react";

export default function Header({ provider, setProvider, onClear, onToggleTheme, darkMode, onLogout }) {
  return (
    <header className={`flex items-center justify-between p-4 md:px-12 ${darkMode ? "bg-[#021425] border-b border-[#0b2a40]" : "bg-white/60 backdrop-blur-sm border-b border-gray-200"}`}>
      <div className="flex items-center gap-4">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white font-bold shadow-md">AI</div>
        <div>
          <h2 className="text-lg font-semibold">Your AI Chat</h2>
          <p className="text-xs text-gray-400">Futuristic UI • Provider agnostic</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-md p-2 text-sm bg-transparent border border-gray-200">
          <option value="gemini">Gemini (Google)</option>
          <option value="openai">ChatGPT (OpenAI)</option>
        </select>

        <button onClick={onClear} className="p-2 rounded-md hover:bg-gray-100/50">
          <Trash2 size={16} />
        </button>

        <button onClick={onToggleTheme} className="p-2 rounded-md hover:bg-gray-100/50">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
