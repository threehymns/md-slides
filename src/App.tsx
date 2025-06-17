
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PresentationsProvider } from "@/contexts/PresentationsContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import EditPage from "./pages/EditPage";
import Slideshow from "./components/Slideshow";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

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
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/edit" element={<EditPage />} />
                  </Route>
                  <Route path="/present" element={<Slideshow />} />
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
