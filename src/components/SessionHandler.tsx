"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { startUserSession, updateSessionHeartbeat } from "@/lib/actions/analytics";

const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 menit
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 jam

export default function SessionHandler() {
  const { data: session, status } = useSession();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const lastActivity = useRef<number>(Date.now());
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize Session
  useEffect(() => {
    if (status === "authenticated" && !sessionId) {
      const initSession = async () => {
        try {
          const id = await startUserSession();
          if (id) setSessionId(id);
        } catch (err) {
          console.error("Failed to start session:", err);
        }
      };
      initSession();
    }
  }, [status, sessionId]);

  // Heartbeat & Inactivity Monitoring
  useEffect(() => {
    if (!sessionId || status !== "authenticated") return;

    // Reset Inactivity on events
    const resetInactivity = () => {
      lastActivity.current = Date.now();
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetInactivity));

    // Heartbeat Interval
    heartbeatTimer.current = setInterval(async () => {
      try {
        await updateSessionHeartbeat(sessionId, HEARTBEAT_INTERVAL / 1000);
      } catch (err) {
        console.error("Heartbeat failed:", err);
      }
    }, HEARTBEAT_INTERVAL);

    // Inactivity Check Interval
    inactivityTimer.current = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity.current > INACTIVITY_TIMEOUT) {
        console.log("Inactivity timeout reached. Logging out...");
        signOut({ callbackUrl: "/login?reason=idle" });
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetInactivity));
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
      if (inactivityTimer.current) clearInterval(inactivityTimer.current);
    };
  }, [sessionId, status]);

  return null; // This component doesn't render anything
}
