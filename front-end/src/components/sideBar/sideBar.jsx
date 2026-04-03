import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { getFriends } from "../../rtk/thunks/friendThunk/friendThunk";
import { getFriendRequests } from "../../rtk/thunks/friendsRequestThunk/friendRequestThunk";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function IconLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
      <path
        d="M12 3C6.925 3 3 6.425 3 10.75c0 2.177.996 4.165 2.67 5.59L5 21l4.109-2.054c.91.204 1.876.304 2.891.304 5.075 0 9-3.425 9-7.75S17.075 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 10.5h8M8 14h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 10h10M7 14h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 3C6.925 3 3 6.425 3 10.75c0 2.177.996 4.165 2.67 5.59L5 21l4.109-2.054c.91.204 1.876.304 2.891.304 5.075 0 9-3.425 9-7.75S17.075 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M8.5 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 19a5 5 0 0 1 10 0M14 18.5a4 4 0 0 1 6.5-3.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M3.5 8.5A2.5 2.5 0 0 1 6 6h4l2 2h6a2.5 2.5 0 0 1 2.5 2.5V16A2.5 2.5 0 0 1 18 18.5H6A2.5 2.5 0 0 1 3.5 16V8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInbox() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 13h4l1.5 2h4l1.5-2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m21 3-8.5 18-2.6-7-7-2.6L21 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m19.4 15-.8 1.39.23 1.6-1.46.84-1.26-1-1.54.42-.57 1.5h-1.68l-.57-1.5-1.54-.42-1.26 1-1.46-.84.23-1.6L4.6 15l-.97-1.19.8-1.39-.23-1.6 1.46-.84 1.26 1 1.54-.42.57-1.5h1.68l.57 1.5 1.54.42 1.26-1 1.46.84-.23 1.6.8 1.39L19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const mainNavItems = [
  { label: "Chats", icon: IconChat, to: "/", badge: null, end: true },
  { label: "Conversations", icon: IconFolder, to: "/conversations", badgeKey: "conversationsCount" },
  { label: "Friends", icon: IconUsers, to: "/friends", badgeKey: "friendsCount" },
  { label: "Received Requests", icon: IconInbox, to: "/received-requests", badgeKey: "receivedRequestsCount" },
  { label: "Sent Requests", icon: IconSend, to: "/sent-requests", badge: null },
  { label: "Settings", icon: IconSettings, to: "/settings", badge: null },
];

function SideBar({
  isDark,
  isDesktopCollapsed,
  isMobileSidebarOpen,
  onCloseMobile,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { friends } = useSelector((state) => state.friend);
  const { friendRequests } = useSelector((state) => state.friendRequest);
  const { user } = useSelector((state) => state.userProfile);
  const desktopWidth = isDesktopCollapsed ? "lg:w-28" : "lg:w-80";
  const [conversationsCount, setConversationsCount] = useState(0);

  useEffect(() => {
    dispatch(getFriends());
    dispatch(getFriendRequests());
  }, [dispatch]);

  useEffect(() => {
    const loadConversationCount = async () => {
      if (!friends?.length) {
        setConversationsCount(0);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const responses = await Promise.all(
          friends.map((friend) =>
            axios.get(`${API_URL}/messages/${friend.friendId?._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        const unreadConversationUsers = responses.filter((response, index) =>
          (response.data || []).some(
            (message) =>
              String(message.sender) === String(friends[index]?.friendId?._id) &&
              String(message.recipient) === String(user?._id) &&
              !message.isRead
          )
        ).length;

        setConversationsCount(unreadConversationUsers);
      } catch (_error) {
        setConversationsCount(0);
      }
    };

    loadConversationCount();
  }, [friends, location.pathname, user?._id]);

  const friendsCount = Array.isArray(friends) ? friends.length : 0;
  const receivedRequestsCount = Array.isArray(friendRequests) ? friendRequests.length : 0;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 backdrop-blur-sm transition lg:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{ background: "var(--overlay-bg)" }}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-[88%] max-w-[320px] flex-col border-r p-3 shadow-2xl backdrop-blur-2xl transition-transform duration-300 sm:w-[360px] sm:p-4 lg:static lg:max-w-none lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:p-2.5 lg:shadow-none ${desktopWidth} ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          borderColor: "var(--panel-border)",
          background: "var(--sidebar-bg)",
          boxShadow: isDark ? "0 24px 60px rgba(2,6,23,0.42)" : "0 24px 60px rgba(148,163,184,0.18)",
        }}
      >
        <div
          className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.55rem] border p-3 sm:rounded-[1.75rem] sm:p-3.5 lg:backdrop-blur-xl"
          style={{
            borderColor: "var(--panel-border)",
            background: "var(--panel-bg)",
            boxShadow: isDark
              ? "inset 0 1px 0 rgba(255,255,255,0.04)"
              : "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div
              className={`flex items-center gap-3 ${
                isDesktopCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                <IconLogo />
              </div>

              {!isDesktopCollapsed && (
                <div>
                  <p className="text-[13px] font-semibold tracking-[0.02em]" style={{ color: "var(--app-text)" }}>Chat Orbit</p>
                  <p className="text-[11px]" style={{ color: "var(--muted-text)" }}>Messaging Hub</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1rem] border lg:hidden"
              style={{
                borderColor: "var(--panel-border)",
                background: "var(--panel-bg)",
                color: "var(--soft-text)",
              }}
              aria-label="Close sidebar"
            >
              <IconClose />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            <nav className="space-y-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const badge =
                item.badgeKey === "friendsCount"
                  ? friendsCount
                  : item.badgeKey === "conversationsCount"
                    ? conversationsCount
                    : item.badgeKey === "receivedRequestsCount"
                      ? receivedRequestsCount
                      : item.badge;
              const isChatRoute = /^\/friends\/[^/]+$/.test(location.pathname);
              const isActiveOverride =
                item.label === "Chats"
                  ? location.pathname === "/" || isChatRoute
                  : item.label === "Friends"
                    ? location.pathname === "/friends"
                    : null;

              return (
                <NavLink
                  key={item.label}
                  to={item.to || "#"}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex w-full items-center rounded-[1rem] border px-3 py-2.5 text-left transition duration-200 ${
                      (isActiveOverride ?? isActive)
                        ? ""
                        : "border-transparent hover:-translate-y-0.5 hover:bg-white/[0.08]"
                    } ${isDesktopCollapsed ? "lg:justify-center" : "gap-3"}`
                  }
                  style={({ isActive }) => {
                    const resolvedIsActive = isActiveOverride ?? isActive;

                    return {
                      borderColor: resolvedIsActive ? "rgba(8,145,178,0.18)" : "transparent",
                      background: resolvedIsActive ? "rgba(8,145,178,0.12)" : "rgba(255,255,255,0.02)",
                      color: resolvedIsActive ? "var(--accent)" : "var(--soft-text)",
                    };
                  }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] bg-white/5 text-current">
                    <Icon />
                  </span>

                  {!isDesktopCollapsed && (
                    <>
                      <span className="min-w-0 flex-1 text-[13px] font-medium">
                        {item.label}
                      </span>
                      {badge !== null && badge !== undefined && (
                        <span
                          className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                          style={
                            item.badgeKey === "receivedRequestsCount" ||
                            item.badgeKey === "conversationsCount"
                              ? {
                                  borderColor: "rgba(239,68,68,0.18)",
                                  background: badge > 0 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.08)",
                                  color: badge > 0 ? "#dc2626" : "var(--app-text)",
                                }
                              : {
                                  borderColor: "var(--panel-border)",
                                  background: "rgba(255,255,255,0.08)",
                                  color: "var(--app-text)",
                                }
                          }
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
            </nav>
          </div>

          <div className="shrink-0 pt-6">
            <div
              className={`rounded-[1.3rem] border border-white/10 bg-slate-950/55 p-3 sm:p-3.5 ${
                isDesktopCollapsed ? "lg:px-2 lg:py-4" : ""
              }`}
              style={{
                borderColor: "var(--panel-border)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
              }}
            >
              {isDesktopCollapsed ? (
                <div className="hidden items-center justify-center lg:flex">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-400 text-sm font-bold text-slate-950 sm:h-12 sm:w-12">
                    AH
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br from-amber-200 to-orange-400 text-[13px] font-bold text-slate-950">
                    AH
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold" style={{ color: "var(--app-text)" }}>
                      Ahmad
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="truncate text-[11px]" style={{ color: "var(--muted-text)" }}>
                        Active now
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
