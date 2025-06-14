
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PresentationsProvider } from "@/contexts/PresentationsContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="slideshow-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PresentationsProvider>
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
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
