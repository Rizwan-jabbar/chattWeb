import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getRegisteredUsers } from "../../rtk/thunks/registerThunk/registerThunk";
import { sendFriendRequest } from "../../rtk/thunks/friendsRequestThunk/friendRequestThunk";
import { getFriends } from "../../rtk/thunks/friendThunk/friendThunk";
import { resetLoginState } from "../../rtk/slices/loginSlice/loginSlice";
import { resetUserProfileState } from "../../rtk/slices/userProfileSlice/userProfileSlice";
import {
  getNotificationsThunk,
  markNotificationAsReadThunk,
  sendNotificationThunk,
} from "../../rtk/thunks/notificationThunk/notificationThunk";

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPanel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 4v16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.59 1.59M6.87 17.13l-1.59 1.59M18.72 18.72l-1.59-1.59M6.87 6.87 5.28 5.28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M20 15.2A7.8 7.8 0 1 1 8.8 4 8.8 8.8 0 0 0 20 15.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M14 7V5.75A2.75 2.75 0 0 0 11.25 3h-4.5A2.75 2.75 0 0 0 4 5.75v12.5A2.75 2.75 0 0 0 6.75 21h4.5A2.75 2.75 0 0 0 14 18.25V17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 12h10m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M9.5 20a2.5 2.5 0 0 0 5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 16.5h12c-1.1-1.1-1.75-2.62-1.75-4.18v-1.07a4.25 4.25 0 1 0-8.5 0v1.07c0 1.56-.65 3.08-1.75 4.18Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header({
  isDark,
  onToggleTheme,
  isDesktopCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { registeredUsers, loading } = useSelector((state) => state.register);
  const { user: loggedInUser } = useSelector((state) => state.userProfile);
  const { friends } = useSelector((state) => state.friend);
  const { notifications, loading: notificationLoading } = useSelector((state) => state.notification);

  useEffect(() => {
    if (!friends?.length) {
      dispatch(getFriends());
    }
  }, [dispatch, friends?.length]);

  useEffect(() => {
    if (loggedInUser?._id) {
      dispatch(getNotificationsThunk());
    }
  }, [dispatch, loggedInUser?._id]);

  useEffect(() => {
    const trimmedValue = searchValue.trim();

    if (!trimmedValue) {
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      dispatch(
        getRegisteredUsers({
          email: trimmedValue,
          excludeUserId: loggedInUser?._id,
        })
      );
      setShowDropdown(true);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [dispatch, loggedInUser?._id, searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    const trimmedValue = searchValue.trim().toLowerCase();

    if (!trimmedValue) {
      return [];
    }

    return registeredUsers.filter((user) => {
      const matchesEmail = user.email?.toLowerCase() === trimmedValue;
      const isCurrentUser =
        user._id === loggedInUser?._id ||
        user.email?.toLowerCase() === loggedInUser?.email?.toLowerCase();

      return matchesEmail && !isCurrentUser;
    });
  }, [loggedInUser?._id, loggedInUser?.email, registeredUsers, searchValue]);

  const friendIds = useMemo(
    () =>
      new Set(
        (friends || [])
          .map((friend) => friend?.friendId?._id)
          .filter(Boolean)
      ),
    [friends]
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification?.isRead).length,
    [notifications]
  );

  const visibleNotifications = useMemo(
    () => notifications.slice(0, 10),
    [notifications]
  );

  const handleSendFriendRequest = (receiverId) => {
    dispatch(sendFriendRequest(receiverId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetLoginState());
    dispatch(resetUserProfileState());
    navigate("/login");
  };


  const handleSendNotification = (recipientId, content) => {
    dispatch(sendNotificationThunk({ recipientId, content }));
  };

  const handleNotificationClick = (notification) => {
    if (!notification?._id || notification.isRead) {
      return;
    }

    dispatch(markNotificationAsReadThunk({ notificationId: notification._id }));
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    return new Date(createdAt).toLocaleString();
  };

  return (
    <header
      className="sticky top-0 z-20 border-b px-3 py-2.5 backdrop-blur-xl sm:px-5 sm:py-3 lg:rounded-t-[2rem] lg:px-6"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--panel-border)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[1.1rem] border transition lg:hidden"
            style={{
              borderColor: "var(--panel-border)",
              background: "var(--panel-bg)",
              color: "var(--soft-text)",
            }}
            aria-label="Open sidebar"
          >
            <IconMenu />
          </button>

          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden h-10 items-center gap-2 rounded-[1.1rem] border px-3.5 text-[13px] font-medium transition lg:inline-flex"
            style={{
              borderColor: "var(--panel-border)",
              background: "var(--panel-bg)",
              color: "var(--soft-text)",
            }}
            aria-label="Toggle sidebar"
          >
            <IconPanel />
            {isDesktopCollapsed ? "Expand" : "Collapse"}
          </button>

          <div>
            <p className="text-sm font-semibold sm:text-[15px]" style={{ color: "var(--app-text)" }}>
              Chats
            </p>
            <p className="hidden text-[11px] sm:block" style={{ color: "var(--muted-text)" }}>
              Smooth, focused conversations
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:gap-2.5 lg:w-auto lg:flex-1 lg:justify-end">
          <div ref={searchDropdownRef} className="relative min-w-0 flex-1 lg:max-w-md">
            <div
              className="flex items-center gap-2 rounded-[1.1rem] border px-3 py-2 sm:gap-2.5 sm:px-3.5 sm:py-2.5"
              style={{
                borderColor: "var(--panel-border)",
                background: "var(--panel-bg)",
                color: "var(--muted-text)",
              }}
            >
              <IconSearch />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (searchValue.trim()) {
                    setShowDropdown(true);
                  }
                }}
                placeholder="Search users by email..."
                className="w-full min-w-0 bg-transparent text-[13px] outline-none sm:text-sm"
                style={{ color: "var(--app-text)" }}
              />
            </div>

            {showDropdown && searchValue.trim() && (
              <div
                className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 overflow-hidden rounded-[1.25rem] border shadow-2xl backdrop-blur-xl sm:rounded-[1.5rem]"
                style={{
                  borderColor: "var(--panel-border)",
                  background: "var(--panel-bg)",
                }}
              >
                {loading ? (
                  <div className="px-4 py-4 text-[13px]" style={{ color: "var(--muted-text)" }}>
                    Searching users...
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="max-h-[58vh] overflow-y-auto p-2 sm:max-h-72">
                    {filteredUsers.map((user) => {
                      const isFriend = friendIds.has(user._id);

                      return (
                        <div
                          key={user._id || user.email}
                          className="flex items-center justify-between gap-2 rounded-[1.1rem] px-2.5 py-2.5 transition hover:bg-white/[0.06] sm:gap-3 sm:px-3 sm:py-2.5"
                        >
                          <button
                            type="button"
                            className="flex min-w-0 flex-1 items-center gap-2.5 text-left sm:gap-3"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-gradient-to-br from-cyan-300 to-blue-500 text-[11px] font-bold text-slate-950 sm:h-10 sm:w-10 sm:text-xs">
                              {(user.username || user.email || "U")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-semibold" style={{ color: "var(--app-text)" }}>
                                {user.username || "User"}
                              </p>
                              <p className="truncate text-[11px]" style={{ color: "var(--muted-text)" }}>
                                {user.email}
                              </p>
                            </div>
                          </button>

                          {isFriend ? (
                            <span
                              className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium"
                              style={{
                                borderColor: "rgba(34,197,94,0.22)",
                                background: "rgba(34,197,94,0.12)",
                                color: "#16a34a",
                              }}
                            >
                              Friends
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleSendFriendRequest(user._id);
                                handleSendNotification(user._id, `${loggedInUser?.username || loggedInUser?.email} sent you a friend request.`);
                              }}
                              className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition hover:opacity-90"
                              style={{
                                borderColor: "rgba(8,145,178,0.18)",
                                background: "rgba(8,145,178,0.12)",
                                color: "var(--accent)",
                              }}
                            >
                              Add Friend
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-[13px]" style={{ color: "var(--muted-text)" }}>
                    No user found for this email.
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={notificationDropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-[1.1rem] border transition sm:h-10 sm:w-10"
              style={{
                borderColor: "var(--panel-border)",
                background: "var(--panel-bg)",
                color: "var(--soft-text)",
              }}
              aria-label="Open notifications"
            >
              <IconBell />
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                  style={{ background: "#dc2626" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] z-30 w-[min(92vw,22rem)] overflow-hidden rounded-[1.5rem] border shadow-2xl backdrop-blur-xl"
                style={{
                  borderColor: "var(--panel-border)",
                  background: "var(--panel-bg)",
                }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{ borderColor: "var(--panel-border)" }}
                >
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--app-text)" }}>
                      Notifications
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--muted-text)" }}>
                      Showing latest {Math.min(visibleNotifications.length, 10)}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <span
                      className="rounded-full px-2 py-1 text-[11px] font-medium"
                      style={{
                        background: "rgba(220,38,38,0.12)",
                        color: "#dc2626",
                      }}
                    >
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                {notificationLoading ? (
                  <div className="px-4 py-6 text-[13px]" style={{ color: "var(--muted-text)" }}>
                    Loading notifications...
                  </div>
                ) : visibleNotifications.length ? (
                  <div className="max-h-[26rem] overflow-y-auto p-2">
                    {visibleNotifications.map((notification) => (
                      <button
                        key={notification._id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="flex w-full flex-col rounded-2xl px-3 py-3 text-left transition hover:bg-white/[0.06]"
                        style={{
                          background: notification?.isRead
                            ? "transparent"
                            : "rgba(8,145,178,0.08)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className="line-clamp-2 text-[13px] font-medium"
                            style={{
                              color: notification?.isRead
                                ? "var(--soft-text)"
                                : "var(--app-text)",
                            }}
                          >
                            {notification?.content || "New notification"}
                          </p>
                          {!notification?.isRead && (
                            <span
                              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ background: "var(--accent)" }}
                            />
                          )}
                        </div>
                        <p className="mt-2 text-[11px]" style={{ color: "var(--muted-text)" }}>
                          {notification?.senderId?.username ||
                            notification?.senderId?.email ||
                            "System"}
                          {" | "}
                          {formatNotificationTime(notification?.createdAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-[13px]" style={{ color: "var(--muted-text)" }}>
                    No notifications yet.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[1.1rem] border transition sm:h-10 sm:w-10"
            style={{
              borderColor: "var(--panel-border)",
              background: "var(--panel-bg)",
              color: "var(--soft-text)",
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <IconSun /> : <IconMoon />}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[1.1rem] border transition sm:h-10 sm:w-10 lg:h-10 lg:w-auto lg:gap-2 lg:px-3.5"
            style={{
              borderColor: "rgba(239,68,68,0.18)",
              background: "rgba(239,68,68,0.1)",
              color: "#dc2626",
            }}
            aria-label="Logout"
          >
            <IconLogout />
            <span className="hidden text-[13px] font-medium lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
