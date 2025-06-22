import React from 'react';
import Settings from '@/components/Settings';
import { useNavigate } from 'react-router-dom'; // To handle closing

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  // The Settings component is always open on this page.
  // Closing it should navigate away or to a previous relevant page.
  // For simplicity, navigating back.
  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  // The 'settings' and 'onSettingsChange' props are no longer needed for the Settings component
  // as it now uses the SettingsContext.
  // The isOpen prop is true because this page is dedicated to showing settings.

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]"> {/* Ensure it's on top */}
      {/* This outer div might not be strictly necessary if Settings component handles its own full-screen overlay */}
      {/* However, keeping it ensures the page context for the modal. */}
      <Settings
        isOpen={true}
        onClose={handleClose}
      />
    </div>
  );
};

export default SettingsPage;