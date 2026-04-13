"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface FontContextType {
  autoFonts: boolean;
  toggleAutoFonts: () => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const useFontSettings = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFontSettings must be used within a FontProvider");
  }
  return context;
};

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [autoFonts, setAutoFonts] = useState<boolean>(true); // Default active

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("auto-fonts-detection");
    if (saved !== null) {
      setAutoFonts(saved === "true");
    }
  }, []);

  // Update body class and localStorage when autoFonts changes
  useEffect(() => {
    if (autoFonts) {
      document.body.classList.add("auto-font-enabled");
    } else {
      document.body.classList.remove("auto-font-enabled");
    }
    localStorage.setItem("auto-fonts-detection", autoFonts.toString());
  }, [autoFonts]);

  const toggleAutoFonts = () => setAutoFonts((prev) => !prev);

  return (
    <FontContext.Provider value={{ autoFonts, toggleAutoFonts }}>
      {children}
    </FontContext.Provider>
  );
};
