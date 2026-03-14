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
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4 bg-background">
        <div className="text-4xl">💬</div>
        <div>
          <h2 className="text-lg font-bold">Siapa nama Anda?</h2>
          <p className="text-sm text-muted">Beri tahu keluarga siapa yang sedang mengirim pesan.</p>
        </div>
        <form onSubmit={handleSaveName} className="w-full max-w-xs space-y-3">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Masukkan Nama/ID Anda..."
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-full">
            Mulai Chat
          </button>
        </form>
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
            isOwn={msg.senderId === currentUser.id} 
          />
        ))}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSend} />
      
      {/* Option to change name (Temporary) */}
      <button 
        onClick={() => setIsNameSet(false)}
        className="absolute top-2 right-2 p-1 text-[10px] bg-card/80 backdrop-blur border rounded opacity-50 hover:opacity-100 transition-opacity"
      >
        Ganti Nama: {guestName}
      </button>
    </div>
  );
}
