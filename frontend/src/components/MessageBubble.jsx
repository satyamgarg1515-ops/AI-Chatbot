import React from "react";

export default function MessageBubble({ msg, darkMode, time }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-sm">
          AI
        </div>
      )}
      <div className={`max-w-[78%] p-4 rounded-2xl shadow-lg text-sm leading-relaxed ${isUser ? (darkMode ? "bg-indigo-600 text-white rounded-br-none" : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none") : (darkMode ? "bg-[#08202b] text-gray-100 rounded-bl-none" : "bg-gray-100 text-gray-900 rounded-bl-none")}`}>
        <div className="whitespace-pre-wrap">{msg.content}</div>
        <div className={`text-[11px] mt-2 text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{time}</div>
      </div>
      {isUser && <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">You</div>}
    </div>
  );
}
