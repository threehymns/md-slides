import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useOutlet, useNavigate } from "react-router-dom";
import React, {
  ReactNode,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Button } from "@/components/ui/button";
import { Play, Settings as SettingsIcon } from "lucide-react";
import { usePresentations } from "@/contexts/PresentationsContext";
import Settings from "@/components/Settings";
import { AppSettings } from "@/types";

// Define the shape of the context
interface AppSettingsContextType {
  settings: AppSettings;
}

// Create the context
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

// Custom hook to use the AppSettings context
export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider",
    );
  }
  return context.settings;
};

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const { getCurrentPresentation, updatePresentation } = usePresentations();
  const outlet = useOutlet();
  const currentPresentation = getCurrentPresentation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showProgressBar: false,
    showSlideCounter: true,
    showNavigationHint: true,
    autoHideControls: false,
    showSlideNumbers: true,
    style: {
      fontFamily: "system-ui, sans-serif",
      fontSize: 5,
      lineHeight: 1.6,
      textAlign: "center",
    },
  });

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handlePresentationTitleChange = (newTitle: string) => {
    if (currentPresentation) {
      updatePresentation(currentPresentation.id, { title: newTitle });
    }
  };

  const handleStartPresentation = () => {
    navigate("/present");
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <AppSidebar />
      <AppSettingsContext.Provider value={{ settings }}>
        <SidebarInset className="overflow-hidden">
          <div className="px-2 py-1 border-b flex items-center gap-2">
            <SidebarTrigger />
            {currentPresentation && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  value={currentPresentation.title}
                  onChange={(e) =>
                    handlePresentationTitleChange(e.target.value)
                  }
                  className="px-2 rounded w-full text-lg font-semibold bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  placeholder="Presentation title..."
                />

                <Button
                  onClick={handleStartPresentation}
                  size="sm"
                  className="ml-2"
                >
                  <Play />
                  Present
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenSettings}
              className="ml-auto"
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100vh-61px)] overflow-y-auto">
            {children || outlet}
          </div>
        </SidebarInset>
      </AppSettingsContext.Provider>
      <Settings
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </>
  );
};

export default MainLayout;
