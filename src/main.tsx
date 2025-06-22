import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext.tsx';
import { ThemeProvider } from "@/components/ThemeProvider.tsx"; // Assuming ThemeProvider might use settings later

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </SettingsProvider>
  </React.StrictMode>
);
