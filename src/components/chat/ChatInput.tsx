"use client";

import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";

interface ChatInputProps {
  onSend: (content: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    onSend(text.trim());
    setText("");
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-card border-t border-border sticky bottom-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan..."
          className="flex-1 bg-background border border-border rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-[40px] max-h-[120px]"
          style={{ height: "auto", minHeight: "40px" }}
        />
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center w-[40px] h-[40px]"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
