import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFriend, getFriends } from "../../rtk/thunks/friendThunk/friendThunk";

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M4 7h16M9.5 11.5v5M14.5 11.5v5M8.5 4h7l.5 2.5h3A1 1 0 0 1 20 7.5v.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-.5a1 1 0 0 1 1-1h3L8.5 4ZM6.5 9h11l-.6 8.2A2 2 0 0 1 14.91 19H9.09a2 2 0 0 1-1.99-1.8L6.5 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Friends() {
  const dispatch = useDispatch();
  const { friends, loading } = useSelector((state) => state.friend);

  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  const handleDeleteFriend = async (friendId) => {
    try {
      await dispatch(deleteFriend({ friendId })).unwrap();
    } catch (_error) {
      return;
    }
  };

  if (loading) {
    return (
      <div
        className="flex h-full min-h-[420px] items-center justify-center rounded-[1.5rem] border sm:rounded-[2rem]"
        style={{ borderColor: "var(--panel-border)", background: "var(--panel-bg)" }}
      >
        <p className="text-sm" style={{ color: "var(--soft-text)" }}>Loading friends...</p>
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
        <h1 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--app-text)" }}>Friends</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
          Total friends: {Array.isArray(friends) ? friends.length : 0}
        </p>
      </div>

      <div className="mt-4 space-y-3 sm:mt-5">
        {friends?.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="flex items-center justify-between gap-3 rounded-[1.25rem] border px-3.5 py-3.5 transition sm:rounded-[1.5rem] sm:px-4 sm:py-4"
              style={{
                borderColor: "var(--panel-border)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <Link
                to={`/friends/${friend.friendId?._id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
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
                    {friend.friendId?.email || "No email available"}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => handleDeleteFriend(friend.friendId?._id)}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition hover:opacity-90"
                style={{
                  borderColor: "rgba(239,68,68,0.2)",
                  background: "rgba(239,68,68,0.08)",
                  color: "#dc2626",
                }}
              >
                <IconTrash />
                Delete
              </button>
            </div>
          ))
        ) : (
          <div
            className="rounded-[1.25rem] border border-dashed px-4 py-10 text-center sm:rounded-[1.5rem]"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--muted-text)" }}>No friends added yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Friends;
