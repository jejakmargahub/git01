"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = format(new Date(message.createdAt), "HH:mm", { locale: id });

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      {/* Bubble */}
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl shadow-sm text-sm ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-card text-card-foreground border border-border rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {/* Format: Name: Content */}
          <span className="font-bold opacity-90 mr-1.5">
            {message.sender?.fullName || "Pengguna"}:
          </span>
          {message.content.includes(":") && message.content.split(":")[0].length < 20
            ? message.content.substring(message.content.indexOf(":") + 1).trim()
            : message.content}
        </p>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1 opacity-70 ${isOwn ? "text-right" : "text-left"}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
