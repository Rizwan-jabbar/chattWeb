import { useEffect, useState } from "react";

function useResponsiveSidebar() {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  };
}

export default useResponsiveSidebar;
