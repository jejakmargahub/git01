"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher";
import { Message, User } from "@/lib/db/schema";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { sendMessage } from "@/lib/actions/chat";

interface ChatWindowProps {
  familyId: string;
  initialMessages: any[];
  currentUser: any;
}

export default function ChatWindow({ familyId, initialMessages, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>(initialMessages.reverse());
  const [guestName, setGuestName] = useState<string>("");
  const [isNameSet, setIsNameSet] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load guest name from localStorage for testing persistence
  useEffect(() => {
    const savedName = localStorage.getItem("chat_guest_name");
    if (savedName) {
      setGuestName(savedName);
      setIsNameSet(true);
    }
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();
    const channelName = `private-family-${familyId}`;
    pusher.subscribe(channelName);

    pusher.bind("new-message", (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.unbind_all();
    };
  }, [familyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isNameSet]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(familyId, content, guestName);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      localStorage.setItem("chat_guest_name", guestName.trim());
      setIsNameSet(true);
    }
  };

  /**
   * NOTE: TEMP TESTING FEATURE
   * To disable: Remove the !isNameSet condition and the 
   * "Set Name Placeholder" section below.
   */
  if (!isNameSet && (currentUser.name === "Pengguna" || !currentUser.id)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-fade-in">
        <div className="card w-full max-w-sm shadow-xl animate-slide-up space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🌳</div>
            <h2 className="text-xl font-bold">Identitas Chat</h2>
            <p className="text-sm text-muted">Beri tahu keluarga siapa yang sedang mengetik.</p>
          </div>
          
          <form onSubmit={handleSaveName} className="space-y-4">
            <div className="input-group">
              <label className="input-label">Nama Anda</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Contoh: Budi, Istri Chris, dll..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Masuk ke Ruang Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.senderId === currentUser.id && (!guestName || msg.content.startsWith(`${guestName}:`))} 
          />
        ))}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} />
      
      {/* Option to change name (Temporary) */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button 
          onClick={() => setIsNameSet(false)}
          className="px-3 py-1.5 text-[11px] font-bold bg-white/90 dark:bg-black/90 backdrop-blur border border-primary/20 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all"
        >
          👤 {guestName || "Ganti Profil"}
        </button>
      </div>
    </div>
  );
}
