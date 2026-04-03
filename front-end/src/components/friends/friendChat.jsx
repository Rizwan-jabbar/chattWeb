import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFriend, getFriends } from "../../rtk/thunks/friendThunk/friendThunk";
import {
  getMessages,
  markMessagesAsRead,
  sendMessage,
  sendVoiceMessage,
  sendPictureMessage,
} from "../../rtk/thunks/messageThunk/messageThunk";
import { clearMessageError, clearMessages } from "../../rtk/slices/messageSlice/messageSlice";
import { useVoiceCall } from "../../context/VoiceCallContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE_URL = API_URL.replace(/\/api$/, "");

function IconMic({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="9"
        y="3"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M8.5 21h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconStop({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" />
    </svg>
  );
}

function IconWave({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 14c1.2 0 1.2-4 2.4-4s1.2 8 2.4 8 1.2-12 2.4-12 1.2 12 2.4 12 1.2-8 2.4-8 1.2 4 2.4 4 1.2-2 2.4-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSend({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 3 10 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m21 3-7 18-4-7-7-4 18-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconImage({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="10" r="1.8" fill="currentColor" />
      <path
        d="m6.5 17 4.2-4.2a1 1 0 0 1 1.41 0L14 14.69a1 1 0 0 0 1.41 0l1.09-1.09a1 1 0 0 1 1.41 0L20 15.69"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5.5 5.5c.7-.7 2.1-.7 2.8 0l1.8 1.8c.7.7.7 1.9 0 2.6l-.7.7c-.2.2-.28.5-.2.78.58 2 2.14 3.56 4.14 4.14.28.08.58 0 .78-.2l.7-.7c.7-.7 1.9-.7 2.6 0l1.8 1.8c.7.7.7 2.1 0 2.8l-.6.6c-.8.8-2 1.16-3.1.93-6.02-1.28-10.75-6.01-12.03-12.03-.23-1.1.13-2.3.93-3.1l.6-.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhoneIncoming({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 17 17 7M17 7h-6m6 0v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDownload({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTrash({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
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

function FriendChat() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { friends, loading } = useSelector((state) => state.friend);
  const {
    messages,
    loading: messagesLoading,
    error: messageError,
  } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.userProfile);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreviewUrl, setPicturePreviewUrl] = useState("");
  const [expandedImage, setExpandedImage] = useState("");
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const pictureInputRef = useRef(null);
  const {
    socketConnected,
    activeCall,
    incomingCall,
    callStatus,
    startCall,
    endCall,
  } = useVoiceCall();

  useEffect(() => {
    if (friendId) {
      dispatch(getMessages(friendId));
    }
  }, [dispatch, friendId]);

  useEffect(() => {
    if (friendId) {
      dispatch(markMessagesAsRead(friendId)).then(() => {
        dispatch(getMessages(friendId));
      });
    }
  }, [dispatch, friendId]);

  useEffect(() => {
    if (!friends?.length) {
      dispatch(getFriends());
    }
  }, [dispatch, friends]);

  const scrollToBottom = useCallback((behavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
      });
      return;
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  useLayoutEffect(() => {
    scrollToBottom("auto");
  }, [friendId, messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }

      if (picturePreviewUrl) {
        URL.revokeObjectURL(picturePreviewUrl);
      }

      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
    };
  }, [audioPreviewUrl, picturePreviewUrl]);

  const selectedFriend = friends?.find(
    (friend) => friend.friendId?._id === friendId
  );

  const friendName =
    selectedFriend?.friendId?.username ||
    selectedFriend?.friendId?.email ||
    "Friend";

  const friendInitials = friendName.slice(0, 2).toUpperCase();
  const lastOwnMessageId = [...(messages || [])]
    .reverse()
    .find((chatMessage) => String(chatMessage.sender) === String(user?._id))?._id;
  const isCurrentFriendActiveCall = activeCall?.partnerId === friendId;
  const isCurrentFriendIncomingCall = incomingCall?.fromUserId === friendId;

  const callLabel = isCurrentFriendIncomingCall
    ? "Incoming call"
    : isCurrentFriendActiveCall
      ? callStatus === "connected"
        ? "On call"
        : "Calling"
      : socketConnected
        ? "Voice call"
        : "Offline";

  if (loading && !selectedFriend) {
    return (
      <div
        className="flex h-full min-h-[420px] items-center justify-center rounded-[2rem] border"
        style={{ borderColor: "var(--panel-border)", background: "var(--panel-bg)" }}
      >
        <p className="text-sm" style={{ color: "var(--muted-text)" }}>Loading chat...</p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      await dispatch(
        sendMessage({ recipientId: friendId, content: message.trim() })
      ).unwrap();
      setMessage("");
      scrollToBottom("auto");
    } catch (error) {
      return error;
    }
  };

  const resetVoiceComposer = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }

    setAudioBlob(null);
    setAudioPreviewUrl("");
    setRecordingTime(0);
  };

  const resetPictureComposer = () => {
    if (picturePreviewUrl) {
      URL.revokeObjectURL(picturePreviewUrl);
    }

    setPictureFile(null);
    setPicturePreviewUrl("");

    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      dispatch(clearMessageError());
      return;
    }

    try {
      dispatch(clearMessageError());
      resetVoiceComposer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        stopRecordingTimer();

        if (recordedBlob.size > 0) {
          const previewUrl = URL.createObjectURL(recordedBlob);
          setAudioBlob(recordedBlob);
          setAudioPreviewUrl(previewUrl);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (_error) {
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSendVoiceMessage = async () => {
    if (!audioBlob) {
      return;
    }

    const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, {
      type: audioBlob.type || "audio/webm",
    });

    try {
      await dispatch(sendVoiceMessage({ recipientId: friendId, audioFile })).unwrap();
      resetVoiceComposer();
      scrollToBottom("auto");
    } catch (error) {
      return error;
    }
  };

  const handlePictureSelection = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    dispatch(clearMessageError());
    resetVoiceComposer();
    resetPictureComposer();

    const previewUrl = URL.createObjectURL(selectedFile);
    setPictureFile(selectedFile);
    setPicturePreviewUrl(previewUrl);
  };

  const handleSendPictureMessage = async () => {
    if (!pictureFile) {
      return;
    }

    try {
      await dispatch(
        sendPictureMessage({ recipientId: friendId, pictureFile })
      ).unwrap();
      resetPictureComposer();
      scrollToBottom("auto");
    } catch (error) {
      return error;
    }
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getCallSummary = (chatMessage) => {
    const isOwnMessage = String(chatMessage.sender) === String(user?._id);
    const durationLabel = formatDuration(chatMessage?.callDetails?.duration || 0);
    const isMissedCall = chatMessage?.callDetails?.status === "missed";
    const isDeclinedCall = chatMessage?.callDetails?.status === "declined";

    if (isMissedCall) {
      return {
        title: isOwnMessage ? "You placed a missed voice call" : `${friendName} tried to call you`,
        subtitle: "Missed call",
        isOwnMessage,
      };
    }

    if (isDeclinedCall) {
      return {
        title: isOwnMessage ? "Your call was declined" : `You declined ${friendName}'s call`,
        subtitle: "Declined call",
        isOwnMessage,
      };
    }

    return {
      title: isOwnMessage ? "You made a voice call" : `${friendName} called you`,
      subtitle: `Voice call | ${durationLabel}`,
      isOwnMessage,
    };
  };

  const getAudioUrl = (audioPath) => {
    if (!audioPath) {
      return "";
    }

    if (audioPath.startsWith("http")) {
      return audioPath;
    }

    return `${API_BASE_URL}/${audioPath.replace(/^\/+/, "")}`;
  };

  const getPictureUrl = (picturePath) => {
    if (!picturePath) {
      return "";
    }

    if (picturePath.startsWith("http")) {
      return picturePath;
    }

    return `${API_BASE_URL}/${picturePath.replace(/^\/+/, "")}`;
  };

  const getPictureDownloadName = (picturePath) => {
    if (!picturePath) {
      return "image";
    }

    const normalizedPath = picturePath.split("?")[0];
    return normalizedPath.split("/").pop() || "image";
  };

  const handleDeleteCurrentFriend = async () => {
    if (!friendId) {
      return;
    }

    try {
      await dispatch(deleteFriend({ friendId })).unwrap();
      dispatch(clearMessages());
      navigate("/friends");
    } catch (_error) {
      return;
    }
  };

  return (
    <>
      <section
        className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.4rem] border shadow-2xl sm:rounded-[1.8rem]"
        style={{
          borderColor: "var(--panel-border)",
          background: "var(--panel-bg)",
          boxShadow: "0 22px 60px rgba(51,65,85,0.14)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4 sm:py-3"
          style={{
            borderColor: "var(--panel-border)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <Link
            to="/friends"
            className="inline-flex rounded-[1rem] border px-3 py-1.5 text-[11px] font-medium transition hover:opacity-90"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--soft-text)",
            }}
          >
            Back
          </Link>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br from-cyan-300 to-blue-500 text-[11px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(56,189,248,0.28)] sm:h-10 sm:w-10 sm:text-xs">
            {friendInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold" style={{ color: "var(--app-text)" }}>
              {friendName}
            </p>
            <p className="truncate text-[11px]" style={{ color: "var(--muted-text)" }}>
              chat with your friend
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDeleteCurrentFriend}
            className="inline-flex items-center gap-2 rounded-[1rem] border px-3 py-1.5 text-[11px] font-medium transition hover:opacity-90 sm:px-3.5"
            style={{
              borderColor: "rgba(239,68,68,0.2)",
              background: "rgba(239,68,68,0.08)",
              color: "#dc2626",
            }}
          >
            <IconTrash className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (isCurrentFriendActiveCall) {
                endCall(true);
                return;
              }

              startCall({
                recipientId: friendId,
                recipientName: friendName,
                recipientEmail: selectedFriend?.friendId?.email || "",
              });
            }}
            className="inline-flex items-center gap-2 rounded-[1rem] border px-3 py-1.5 text-[11px] font-medium transition hover:opacity-90 sm:px-3.5"
            style={{
              borderColor: isCurrentFriendActiveCall
                ? "rgba(239,68,68,0.24)"
                : "rgba(8,145,178,0.18)",
              background: isCurrentFriendActiveCall
                ? "rgba(239,68,68,0.12)"
                : "rgba(8,145,178,0.12)",
              color: isCurrentFriendActiveCall ? "#dc2626" : "var(--accent)",
            }}
          >
            <IconPhone className="h-4 w-4" />
            <span>{isCurrentFriendActiveCall ? "End Call" : "Call"}</span>
          </button>
        </div>
        </div>

        {(isCurrentFriendActiveCall || isCurrentFriendIncomingCall) && (
          <div
            className="border-b px-3 py-2 sm:px-4"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(8,145,178,0.08)",
            }}
          >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                {callLabel}
              </p>
              <p className="truncate text-[11px] sm:text-[13px]" style={{ color: "var(--soft-text)" }}>
                {isCurrentFriendIncomingCall
                  ? `${friendName} is calling you`
                  : callStatus === "connected"
                    ? `You are connected with ${friendName}`
                    : `Trying to connect with ${friendName}`}
              </p>
            </div>
            {isCurrentFriendActiveCall ? (
              <button
                type="button"
                onClick={() => endCall(true)}
                className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
                style={{ background: "#ef4444" }}
              >
                End
              </button>
            ) : null}
          </div>
          </div>
        )}

        <div
          ref={messagesContainerRef}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-4"
          style={{ background: "var(--chat-bg)" }}
        >
        <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-end gap-4">
          {messagesLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                Loading messages...
              </p>
            </div>
          ) : messages?.length > 0 ? (
            <>
              {messages.map((chatMessage) => {
                const isOwnMessage = String(chatMessage.sender) === String(user?._id);
                const shouldShowDeliveryStatus =
                  isOwnMessage && chatMessage._id === lastOwnMessageId;

                return (
                  <div
                    key={chatMessage._id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] px-2.5 py-2 sm:max-w-[74%] sm:px-3 sm:py-2 ${
                        isOwnMessage
                          ? "rounded-[1.5rem] rounded-br-md text-slate-950 shadow-[0_14px_35px_rgba(14,165,233,0.2)]"
                          : "rounded-[1.5rem] rounded-bl-md border shadow-[0_12px_30px_rgba(148,163,184,0.12)]"
                      }`}
                      style={
                        isOwnMessage
                          ? { background: "var(--bubble-outgoing)" }
                          : {
                              background: "var(--bubble-incoming)",
                              borderColor: "var(--panel-border)",
                              color: "var(--app-text)",
                            }
                      }
                    >
                    {chatMessage.content ? (
                      <p
                        className={`break-words whitespace-pre-wrap text-[12px] leading-5 sm:text-[13px] sm:leading-5 ${
                          isOwnMessage ? "font-medium" : ""
                        }`}
                        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                      >
                        {chatMessage.content}
                      </p>
                    ) : null}
                    {chatMessage.callDetails?.type === "voice" ? (
                      <div
                        className={`flex min-w-0 max-w-full items-center gap-2 rounded-[0.95rem] border px-2 py-2 sm:gap-2.5 sm:rounded-[1rem] sm:px-2.5 sm:py-2 ${
                          isOwnMessage ? "bg-white/35" : "bg-black/5"
                        }`}
                        style={{
                          borderColor: isOwnMessage
                            ? "rgba(15,23,42,0.08)"
                            : "var(--panel-border)",
                        }}
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                          style={{
                            background: isOwnMessage
                              ? "rgba(15,23,42,0.12)"
                              : "rgba(8,145,178,0.12)",
                            color: isOwnMessage ? "#0f172a" : "var(--accent)",
                          }}
                        >
                          {isOwnMessage ? (
                            <IconPhone className="h-4 w-4" />
                          ) : (
                            <IconPhoneIncoming className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-[12px] font-semibold sm:text-[13px]"
                            style={{
                              color: isOwnMessage ? "#0f172a" : "var(--app-text)",
                            }}
                          >
                            {getCallSummary(chatMessage).title}
                          </p>
                          <p
                            className="mt-1 text-[10px] sm:text-[11px]"
                            style={{
                              color: isOwnMessage
                                ? "rgba(15,23,42,0.72)"
                                : "var(--muted-text)",
                            }}
                          >
                            {getCallSummary(chatMessage).subtitle}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {chatMessage.audio ? (
                      <div
                        className={`${chatMessage.content || chatMessage.callDetails ? "mt-2" : "mt-1"} flex min-w-0 max-w-full items-center gap-2 rounded-[0.95rem] border px-2 py-2 sm:gap-2.5 sm:rounded-[1rem] sm:px-2.5 sm:py-2 ${
                          isOwnMessage ? "bg-white/35" : "bg-black/5"
                        }`}
                        style={{
                          borderColor: isOwnMessage
                            ? "rgba(15,23,42,0.08)"
                            : "var(--panel-border)",
                        }}
                      >
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                          style={{
                            background: isOwnMessage
                              ? "rgba(15,23,42,0.12)"
                              : "rgba(8,145,178,0.12)",
                            color: isOwnMessage ? "#0f172a" : "var(--accent)",
                          }}
                        >
                          <IconMic className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <IconWave
                              className="h-4 w-4"
                            />
                            <span
                              className="text-[10px] font-medium uppercase tracking-[0.16em]"
                              style={{
                                color: isOwnMessage
                                  ? "rgba(15,23,42,0.68)"
                                  : "var(--muted-text)",
                              }}
                            >
                              Voice Message
                            </span>
                          </div>
                          <audio
                            className="h-9 w-full min-w-0 sm:h-10"
                            controls
                            src={getAudioUrl(chatMessage.audio)}
                          />
                        </div>
                      </div>
                    ) : null}
                    {chatMessage.picture ? (
                      <div className={chatMessage.content || chatMessage.audio ? "mt-2" : ""}>
                        <button
                          type="button"
                          onClick={() => setExpandedImage(getPictureUrl(chatMessage.picture))}
                          className="block"
                        >
                          <img
                            src={getPictureUrl(chatMessage.picture)}
                            alt="Shared picture"
                            className="h-auto max-h-[180px] w-[170px] max-w-full rounded-[1rem] object-cover transition hover:opacity-90 sm:max-h-[260px] sm:w-[260px] sm:rounded-[1.2rem]"
                          />
                        </button>
                        <a
                          href={getPictureUrl(chatMessage.picture)}
                          download={getPictureDownloadName(chatMessage.picture)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition hover:opacity-90"
                          style={{
                            borderColor: isOwnMessage
                              ? "rgba(15,23,42,0.12)"
                              : "var(--panel-border)",
                            color: isOwnMessage ? "#0f172a" : "var(--soft-text)",
                            background: isOwnMessage ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <IconDownload className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </div>
                    ) : null}
                    <span
                      className={`block text-[10px] ${chatMessage.content || chatMessage.audio || chatMessage.picture || chatMessage.callDetails ? "mt-2" : ""}`}
                      style={{
                        color: isOwnMessage ? "rgba(15,23,42,0.68)" : "var(--muted-text)",
                      }}
                    >
                      {formatTime(chatMessage.createdAt)}
                    </span>
                    {shouldShowDeliveryStatus ? (
                      <span
                        className="mt-1 block text-[10px] font-medium"
                        style={{ color: "rgba(15,23,42,0.72)" }}
                      >
                        {chatMessage.isRead ? "Seen" : "Delivered"}
                      </span>
                    ) : null}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div
                className="rounded-[1.5rem] border border-dashed px-5 py-7 text-center sm:rounded-[1.8rem] sm:px-6 sm:py-8"
                style={{
                  borderColor: "var(--panel-border)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--soft-text)" }}>
                  No messages yet. Start the conversation with {friendName}.
                </p>
              </div>
            </div>
          )}
        </div>
        </div>

        <div
          className="border-t px-3 pb-2.5 pt-2.5 sm:px-4 sm:pb-3 sm:pt-3"
          style={{
            borderColor: "var(--panel-border)",
            background: "rgba(255,255,255,0.04)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.6rem)",
          }}
        >
        {(isRecording || audioPreviewUrl) && (
          <div
            className="mb-2.5 rounded-[1rem] border px-2.5 py-2 sm:rounded-[1.2rem] sm:px-3 sm:py-2.5"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {isRecording ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-3 w-3 rounded-full bg-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.16)]" />
                  <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>
                    Recording voice message
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: "var(--soft-text)" }}>
                    {formatDuration(recordingTime)}
                  </span>
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    style={{ background: "#ef4444" }}
                  >
                    <IconStop className="h-4 w-4" />
                    Stop
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[1.1rem] border bg-white/40 px-2.5 py-2.5 sm:gap-3 sm:rounded-[1.25rem] sm:px-3 sm:py-3"
                  style={{ borderColor: "var(--panel-border)" }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                    style={{ background: "rgba(8,145,178,0.12)", color: "var(--accent)" }}
                  >
                    <IconMic className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <IconWave className="h-4 w-4" style={{ color: "var(--accent)" }} />
                      <span
                        className="text-[11px] font-medium uppercase tracking-[0.18em]"
                        style={{ color: "var(--muted-text)" }}
                      >
                        Ready To Send
                      </span>
                    </div>
                    <audio className="h-9 w-full min-w-0 sm:h-10" controls src={audioPreviewUrl} />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={resetVoiceComposer}
                    className="flex-1 rounded-full border px-4 py-2 text-xs font-semibold transition hover:opacity-90 sm:flex-none"
                    style={{
                      borderColor: "var(--panel-border)",
                      color: "var(--soft-text)",
                    }}
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleSendVoiceMessage}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:flex-none"
                    style={{ background: "var(--bubble-outgoing)" }}
                  >
                    <IconSend className="h-4 w-4" />
                    Send Voice
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {picturePreviewUrl && (
          <div
            className="mb-2.5 rounded-[1rem] border px-2.5 py-2 sm:rounded-[1.2rem] sm:px-3 sm:py-2.5"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[1.1rem] border bg-white/40 p-2 sm:gap-3 sm:rounded-[1.25rem] sm:p-2.5"
                style={{ borderColor: "var(--panel-border)" }}
              >
                <img
                  src={picturePreviewUrl}
                  alt="Preview"
                  className="h-[68px] w-[68px] shrink-0 rounded-[0.85rem] object-cover sm:h-[96px] sm:w-[96px] sm:rounded-[1rem]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <IconImage className="h-4 w-4" />
                    <p className="truncate text-sm font-medium" style={{ color: "var(--app-text)" }}>
                      {pictureFile?.name || "Selected image"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={resetPictureComposer}
                  className="flex-1 rounded-full border px-4 py-2 text-xs font-semibold transition hover:opacity-90 sm:flex-none"
                  style={{
                    borderColor: "var(--panel-border)",
                    color: "var(--soft-text)",
                  }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSendPictureMessage}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:flex-none"
                  style={{ background: "var(--bubble-outgoing)" }}
                >
                  <IconSend className="h-4 w-4" />
                  Send Photo
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          className="flex min-w-0 items-end gap-2 rounded-[1.05rem] border px-2 py-2 shadow-[0_10px_30px_rgba(148,163,184,0.12)] sm:gap-2.5 sm:rounded-[1.25rem] sm:px-3 sm:py-2.5"
          style={{
            borderColor: "var(--panel-border)",
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePictureSelection}
          />
          <button
            type="button"
            onClick={() => pictureInputRef.current?.click()}
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border transition hover:scale-[1.02] hover:opacity-90 sm:h-10 sm:w-10"
            style={{
              borderColor: "var(--panel-border)",
              background: "rgba(255,255,255,0.22)",
              color: "var(--muted-text)",
              boxShadow: "0 10px 24px rgba(148,163,184,0.12)",
            }}
            aria-label="Choose picture"
          >
            <IconImage className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full border transition hover:scale-[1.02] hover:opacity-90 sm:h-10 sm:w-10"
            style={{
              borderColor: isRecording ? "rgba(239,68,68,0.26)" : "var(--panel-border)",
              background: isRecording ? "rgba(239,68,68,0.14)" : "rgba(255,255,255,0.22)",
              color: isRecording ? "#dc2626" : "var(--muted-text)",
              boxShadow: isRecording
                ? "0 10px 30px rgba(239,68,68,0.16)"
                : "0 10px 24px rgba(148,163,184,0.12)",
            }}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? <IconStop className="h-4 w-4" /> : <IconMic className="h-5 w-5" />}
          </button>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              if (messageError) {
                dispatch(clearMessageError());
              }
            }}
            rows="1"
            placeholder={`Message ${friendName}`}
            className="min-w-0 flex-1 max-h-24 min-h-[20px] resize-none bg-transparent text-[12px] outline-none sm:max-h-28 sm:min-h-[22px] sm:text-[13px]"
            style={{ color: "var(--app-text)" }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="inline-flex h-8.5 shrink-0 items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:opacity-90 sm:h-auto sm:gap-2 sm:px-3.5 sm:text-[11px]"
            style={{
              background: "var(--bubble-outgoing)",
              opacity: message.trim() ? 1 : 0.55,
            }}
          >
            <IconSend className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        {messageError ? (
          <p className="mt-3 px-1 text-sm" style={{ color: "#dc2626" }}>
            {messageError}
          </p>
        ) : null}
        </div>
      </section>

      {expandedImage ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm"
          onClick={() => setExpandedImage("")}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex justify-end gap-2">
              <a
                href={expandedImage}
                download={getPictureDownloadName(expandedImage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  borderColor: "rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <IconDownload className="h-4 w-4" />
                Download
              </a>
              <button
                type="button"
                onClick={() => setExpandedImage("")}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{
                  borderColor: "rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <IconClose className="h-4 w-4" />
                Close
              </button>
            </div>
            <img
              src={expandedImage}
              alt="Expanded chat image"
              className="max-h-[82vh] w-full rounded-[1.5rem] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default FriendChat;
