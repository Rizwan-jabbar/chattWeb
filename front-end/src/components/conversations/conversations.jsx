import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getFriends } from "../../rtk/thunks/friendThunk/friendThunk";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Conversations() {
  const dispatch = useDispatch();
  const { friends, loading } = useSelector((state) => state.friend);
  const { user } = useSelector((state) => state.userProfile);
  const [conversationUsers, setConversationUsers] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!friends?.length) {
      dispatch(getFriends());
    }
  }, [dispatch, friends?.length]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!friends?.length) {
        setConversationUsers([]);
        setConversationsLoading(false);
        return;
      }

      setConversationsLoading(true);

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

        const conversations = responses
          .map((response, index) => {
            const messages = response.data || [];

            if (!messages.length) {
              return null;
            }

            const latestMessage = messages[messages.length - 1];
            const friendName =
              friends[index]?.friendId?.username ||
              friends[index]?.friendId?.email ||
              "User";
            const isOwnMessage =
              String(latestMessage?.sender) !==
              String(friends[index]?.friendId?._id);

            let preview = "Started a conversation";

            if (latestMessage?.content) {
              preview = latestMessage.content;
            } else if (latestMessage?.callDetails?.type === "voice") {
              preview = isOwnMessage
                ? `You made a voice call • ${formatDuration(latestMessage.callDetails?.duration || 0)}`
                : `${friendName} called you • ${formatDuration(latestMessage.callDetails?.duration || 0)}`;
            } else if (latestMessage?.picture) {
              preview = isOwnMessage
                ? "You sent a picture"
                : `${friendName} sent a picture`;
            } else if (latestMessage?.audio) {
              preview = isOwnMessage
                ? "You sent a voice message"
                : `${friendName} sent a voice message`;
            }

            return {
              friend: friends[index],
              preview,
              unreadCount: messages.filter(
                (message) =>
                  String(message.sender) === String(friends[index]?.friendId?._id) &&
                  String(message.recipient) === String(user?._id) &&
                  !message.isRead
              ).length,
              latestAt: latestMessage?.createdAt || friends[index]?.updatedAt,
            };
          })
          .filter(Boolean)
          .sort((first, second) => new Date(second.latestAt) - new Date(first.latestAt));

        setConversationUsers(conversations);
      } catch (_error) {
        setConversationUsers([]);
      } finally {
        setConversationsLoading(false);
      }
    };

    loadConversations();
  }, [friends, user?._id]);

  if (loading || conversationsLoading) {
    return (
      <div
        className="flex h-full min-h-[420px] items-center justify-center rounded-[1.5rem] border sm:rounded-[2rem]"
        style={{ borderColor: "var(--panel-border)", background: "var(--panel-bg)" }}
      >
        <p className="text-sm" style={{ color: "var(--soft-text)" }}>
          Loading conversations...
        </p>
      </div>
    );
  }

  return (
    <section
      className="rounded-[1.5rem] border p-4 shadow-2xl sm:rounded-[2rem] sm:p-5"
      style={{
        borderColor: "var(--panel-border)",
        background: "var(--panel-bg)",
        boxShadow: "0 22px 60px rgba(51,65,85,0.14)",
      }}
    >
      <div className="border-b pb-4" style={{ borderColor: "var(--panel-border)" }}>
        <h1 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--app-text)" }}>
          Conversations
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
          Users you have already chatted with.
        </p>
      </div>

      <div className="mt-4 space-y-3 sm:mt-5">
        {conversationUsers.length > 0 ? (
          conversationUsers.map(({ friend, preview, unreadCount }) => (
            <Link
              key={friend._id}
              to={`/friends/${friend.friendId?._id}`}
              className="flex items-center gap-3 rounded-[1.25rem] border px-3.5 py-3.5 transition sm:rounded-[1.5rem] sm:px-4 sm:py-4"
              style={{
                borderColor: "var(--panel-border)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-semibold text-slate-950 sm:h-12 sm:w-12">
                {(friend.friendId?.username || friend.friendId?.email || "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: "var(--app-text)" }}>
                  {friend.friendId?.username || "Unknown User"}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--muted-text)" }}>
                  {preview}
                </p>
              </div>
              {unreadCount > 0 ? (
                <span
                  className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold text-white"
                  style={{ background: "#dc2626" }}
                >
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          ))
        ) : (
          <div
            className="rounded-[1.25rem] border border-dashed px-4 py-10 text-center sm:rounded-[1.5rem]"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted-text)" }}>
              No conversations yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Conversations;
