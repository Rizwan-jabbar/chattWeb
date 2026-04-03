import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFriend } from "../../rtk/thunks/friendThunk/friendThunk";
import {
  getFriendRequests,
  removeFriendRequest,
} from "../../rtk/thunks/friendsRequestThunk/friendRequestThunk";
import { sendNotificationThunk } from "../../rtk/thunks/notificationThunk/notificationThunk";

function ReceivedRequests() {
  const dispatch = useDispatch();
  const { friendRequests, loading } = useSelector((state) => state.friendRequest);
  const { loading: acceptingFriend } = useSelector((state) => state.friend);
  console.log("Received friend requests:", friendRequests);
    const { user: loggedInUser } = useSelector((state) => state.userProfile);
  

  useEffect(() => {
    dispatch(getFriendRequests());
  }, [dispatch]);

  const handleAcceptFriend = async (friendId, requestId) => {
    await dispatch(addFriend({ friendId, requestId }));
    dispatch(getFriendRequests());
  };

  const handleCancelRequest = async (senderId) => {
    await dispatch(removeFriendRequest(senderId));
    dispatch(getFriendRequests());
  };

  if (loading) {
    return (
      <div
        className="flex h-full min-h-[420px] items-center justify-center rounded-[1.5rem] border sm:rounded-[2rem]"
        style={{ borderColor: "var(--panel-border)", background: "var(--panel-bg)" }}
      >
        <p className="text-sm" style={{ color: "var(--soft-text)" }}>Loading friend requests...</p>
      </div>
    );
  }

  const handleSendNotification = (recipientId, content) => {
  console.log("Sending notification to:", recipientId, "with content:", content);
    dispatch(sendNotificationThunk({ recipientId, content }));
  };

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
        <h1 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--app-text)" }}>Received Requests</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
          People who sent you a friend request.
        </p>
      </div>

      <div className="mt-4 space-y-3 sm:mt-5">
        {friendRequests?.length > 0 ? (
          friendRequests.map((request) => (
            <div
              key={request._id}
              className="rounded-[1.25rem] border px-3.5 py-3.5 sm:rounded-[1.5rem] sm:px-4 sm:py-4"
              style={{
                borderColor: "var(--panel-border)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-semibold text-slate-950 sm:h-12 sm:w-12">
                  {(request.senderId?.username || request.senderId?.email || "U")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: "var(--app-text)" }}>
                    {request.senderId?.username || "Unknown User"}
                  </p>
                  <p className="truncate text-xs" style={{ color: "var(--muted-text)" }}>
                    {request.senderId?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
                <span className="rounded-full border px-3 py-1 text-xs font-medium"
                  style={{
                    borderColor: "rgba(245,158,11,0.24)",
                    background: "rgba(245,158,11,0.12)",
                    color: "#b45309",
                  }}
                >
                  {request.status}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleSendNotification(request.senderId?._id, `${loggedInUser?.username || "User"} accepted your friend request.`);
                    handleAcceptFriend(request.senderId?._id, request._id)
                  }}
                  disabled={acceptingFriend}
                  className="rounded-full border px-4 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: "rgba(8,145,178,0.18)",
                    background: "rgba(8,145,178,0.12)",
                    color: "var(--accent)",
                  }}
                >
                  {acceptingFriend ? "Accepting..." : "Accept"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelRequest(request.senderId?._id)}
                  disabled={loading}
                  className="rounded-full border px-4 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: "rgba(239,68,68,0.18)",
                    background: "rgba(239,68,68,0.1)",
                    color: "#dc2626",
                  }}
                >
                  {loading ? "Cancelling..." : "Cancel Request"}
                </button>
              </div>
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
            <p className="text-sm" style={{ color: "var(--muted-text)" }}>No received requests yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReceivedRequests;
