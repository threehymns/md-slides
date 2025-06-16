import React, { useEffect } from 'react';
import PresentationManager from '@/components/PresentationManager';
import { usePresentations } from '@/contexts/PresentationsContext';
import { useParams } from 'react-router-dom'; // To get presentationId from URL

const PresentationManagerPage = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const { currentPresentation, setCurrentPresentationId } = usePresentations();

  useEffect(() => {
    if (presentationId && presentationId !== currentPresentation?.id) {
      setCurrentPresentationId(presentationId);
    }
    // If no presentationId in URL, but there's a current one in context,
    // we might want to navigate to its URL or clear it.
    // For now, this component assumes a presentationId will be in the URL.
  }, [presentationId, currentPresentation, setCurrentPresentationId]);

  if (!presentationId) {
    return <div>Error: No presentation ID provided.</div>;
  }

  // PresentationManager itself relies on PresentationsContext for its data,
  // triggered by setCurrentPresentationId.
  return <PresentationManager />;
};

export default PresentationManagerPage;
