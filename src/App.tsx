import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar"; // Keep for pages that use AppSidebar
import { PresentationsProvider } from "@/contexts/PresentationsContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Page components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SlideshowPage from "./pages/SlideshowPage";
import SettingsPage from "./pages/SettingsPage";
import EditorPage from "./pages/EditorPage";
import PresentationManagerPage from "./pages/PresentationManagerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="slideshow-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PresentationsProvider>
          <BrowserRouter>
            {/* SidebarProvider wraps all routes, as individual pages
                (Index, EditorPage, PresentationManagerPage) will now instantiate AppSidebar,
                which relies on SidebarContext via useSidebar() from "@/components/ui/sidebar" */}
            <SidebarProvider>
              <div className="min-h-screen flex w-full"> {/* This div was part of the old App.tsx, keep it */}
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/editor/:deckId" element={<EditorPage />} />
                  <Route path="/presentation/:presentationId" element={<PresentationManagerPage />} />
                  <Route path="/slideshow" element={<SlideshowPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </PresentationsProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
