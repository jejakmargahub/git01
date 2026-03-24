"use client";

import { SessionProvider } from "next-auth/react";
import SessionHandler from "./SessionHandler";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionHandler />
      {children}
    </SessionProvider>
  );
}
