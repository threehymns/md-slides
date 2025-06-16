import React from 'react'; // Removed useState, useEffect, useMemo
// Removed SidebarInset, SidebarTrigger, Button, SettingsIcon, Play from here, they are in MainLayout
// Removed AppSidebar import, it's in MainLayout
// Removed MarkdownEditor, Slideshow, Settings components, they are separate pages/components
// Removed usePresentations hooks that were for managing views, MainLayout handles its own needs
// Removed PresentationManager import, it's a separate page
// Removed AppSettings, SlideInfo, marked types/imports if no longer used directly here

// This component will now primarily be the landing/welcome page content
// when no specific presentation or deck is selected via the URL.
// The AppSidebar (in MainLayout) will drive navigation to presentations/editors.

const Index = () => {
  // const {
  //   getCurrentSlideDeck, // No longer needed here
  //   currentSlideDeckId, // No longer needed here
  //   getCurrentPresentation, // No longer needed here
  // } = usePresentations(); // No longer needed for view switching

  // The logic to show MarkdownEditor or PresentationManager or Welcome
  // is now handled by routing.
  // If we are at "/", and no presentation/deck is selected by context for AppSidebar to highlight,
  // this Index page component is shown.
  // MainLayout will show the current presentation title if one is active in context.
  // AppSidebar will show selected deck if one is active in context.
  // This component can show a generic welcome or instructions if no presentation is loaded,
  // or it could show some content related to the currently loaded presentation (like a summary)
  // if that's desired. For now, a generic welcome.

  // if (isPresenting) { // Logic moved to /slideshow route
  //   return <Slideshow slides={slides} settings={settings} onSettingsChange={setSettings} />;
  // }

  // The main structure (AppSidebar, SidebarInset, Header) is now in MainLayout.tsx
  // This component renders within the <Outlet /> of MainLayout.

  // return ( // Old structure removed
  //   <>
  //     <AppSidebar />
  //     <SidebarInset className="overflow-hidden">
  //       <div className="px-2 py-1 border-b flex items-center gap-2"> ...header... </div>
  //       <div className="bg-card/10 overflow-y-auto h-[calc(100vh-41px)]">
  //         {currentDeck ? (
  //           <MarkdownEditor />
  //         ) : currentPresentation ? (
  //           <PresentationManager />
  //         ) : (
  //           ... welcome message ...
  //         )}
  //       </div>
  //     </SidebarInset>
  //     <Settings/>
  //   </>
  // );

  // New simplified Index page - serves as the default view under MainLayout
  return (
    <div className="min-h-[calc(100vh-61px)] flex items-center justify-center bg-background p-4"> {/* Adjusted padding and container */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to Markdown Slideshow</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create a new presentation or select an existing one from the sidebar to get started.
        </p>
        <p className="text-md text-muted-foreground">
          Use the sidebar to manage your presentations and slide decks.
        </p>
        <p className="text-md text-muted-foreground mt-2">
          Click the <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Present</kbd> button to start your slideshow.
        </p>
        <p className="text-md text-muted-foreground mt-2">
          Access application settings by clicking the gear icon.
        </p>
      </div>
    </div>
  );
};

export default Index;
