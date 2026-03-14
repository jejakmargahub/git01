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
  const scrollRef = useRef<HTMLDivElement>(null);

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
  }, [messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(familyId, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
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
    </div>
  );
}
