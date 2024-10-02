import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const usePrompt = (when, message) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message; // For older browsers
      }
    };

    const handleRouteChange = (event) => {
      if (when) {
        const confirmLeave = window.confirm(message);
        if (!confirmLeave) {
          event.preventDefault();
        }
      }
    };

    // Listen for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Add event listener for navigation
    window.addEventListener('popstate', handleRouteChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [when, message, navigate]);
};

export default usePrompt;
