import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop: scrolls the window to top on every route change so the new page starts at the top.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Run after paint so the new page content is in the DOM, then scroll to top
    const id = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
};
