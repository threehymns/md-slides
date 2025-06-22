import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useOutlet, useNavigate } from "react-router-dom";
import React, {
  ReactNode,
  useState,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Play, Settings as SettingsIcon } from "lucide-react";
import { usePresentations } from "@/contexts/PresentationsContext";
import Settings from "@/components/Settings";
// AppSettings and related context are removed, will use SettingsContext from '@/contexts/SettingsContext'
// No need to import useSettings here if MainLayout itself doesn't directly consume settings values,
// but Settings component it renders will use it.

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const { getCurrentPresentation, updatePresentation } = usePresentations();
  const outlet = useOutlet();
  const currentPresentation = getCurrentPresentation();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Local settings state is removed. Settings are now global.
  // const { settings, updateSetting } = useSettings(); // If MainLayout needed to change/read settings directly

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
      {/* AppSettingsContext.Provider is removed */}
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
      <Settings
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        // settings and onSettingsChange props are removed
      />
    </>
  );
};

export default MainLayout;
