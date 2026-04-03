import { Outlet } from "react-router-dom";
import Header from "../header/header";
import SideBar from "../sideBar/sideBar";
import useResponsiveSidebar from "../../hooks/useResponsiveSidebar";
import useTheme from "../../hooks/useTheme";

function Layout() {
  const {
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useResponsiveSidebar();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_26%),linear-gradient(145deg,_rgba(255,255,255,0.76)_0%,_rgba(226,232,240,0.72)_52%,_rgba(191,219,254,0.52)_100%)] theme-dark:bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_26%),linear-gradient(145deg,_#020617_0%,_#0f172a_50%,_#111827_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      <div className="relative flex h-screen">
        <SideBar
          isDark={isDark}
          isDesktopCollapsed={isDesktopCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex h-screen min-w-0 flex-1 flex-col lg:p-3">
          <div
            className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:rounded-[2rem] lg:border lg:shadow-[0_30px_80px_rgba(51,65,85,0.14)] lg:backdrop-blur-xl"
            style={{
              background: "var(--shell-bg)",
              borderColor: "var(--shell-border)",
            }}
          >
            <Header
              isDark={isDark}
              onToggleTheme={toggleTheme}
              isDesktopCollapsed={isDesktopCollapsed}
              onToggleDesktopSidebar={() =>
                setIsDesktopCollapsed((prev) => !prev)
              }
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />
            <main className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-4 lg:px-4 lg:pb-4 lg:pt-4">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
