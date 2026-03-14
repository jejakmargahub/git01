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
      {/* Sender Name */}
      {!isOwn && (
        <span className="text-xs font-medium text-muted-foreground ml-2 mb-1">
          {message.sender?.fullName || "Nama Tidak Diketahui"}
        </span>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-card text-card-foreground border border-border rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1 opacity-70 ${isOwn ? "text-right" : "text-left"}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
