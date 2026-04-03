import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function IconPhoneOff({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="m4 4 16 16M8.7 8.7l-.4.4a1.83 1.83 0 0 0-.47 1.78 10.03 10.03 0 0 0 5.3 5.3c.63.22 1.33.04 1.78-.47l.7-.7c.52-.52 1.35-.6 1.96-.2l2.3 1.5a1.8 1.8 0 0 1 .4 2.72l-.03.03a3.47 3.47 0 0 1-3.1.92 17.02 17.02 0 0 1-13.1-13.1 3.47 3.47 0 0 1 .92-3.1L5 3.76a1.8 1.8 0 0 1 2.72.4l1.5 2.3c.4.6.32 1.44-.2 1.96l-.32.28"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMicOff({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15 10.5V7a3 3 0 1 0-6 0v5M7 12a5 5 0 0 0 8.8 3.2M3 3l18 18M12 17v4M8.5 21h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

function VoiceCallOverlay({
  incomingCall,
  activeCall,
  callStatus,
  callError,
  isMuted,
  callDuration,
  acceptIncomingCall,
  declineIncomingCall,
  endCall,
  toggleMute,
}) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const dragStateRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const partner = incomingCall
    ? {
        id: incomingCall.fromUserId,
        name: incomingCall.fromUserName,
        email: incomingCall.fromUserEmail,
      }
    : activeCall
      ? {
          id: activeCall.partnerId,
          name: activeCall.partnerName,
          email: activeCall.partnerEmail,
        }
      : null;

  const statusLabel = useMemo(() => {
    if (incomingCall) {
      return "Incoming voice call";
    }

    if (callStatus === "calling") {
      return "Calling...";
    }

    if (callStatus === "connecting" || callStatus === "ringing") {
      return "Connecting audio...";
    }

    if (callStatus === "connected") {
      return `On call • ${formatDuration(callDuration)}`;
    }

    return callError || "";
  }, [callDuration, callError, callStatus, incomingCall]);

  useEffect(() => {
    if (!partner && !callError) {
      setPosition({ x: 0, y: 0 });
    }
  }, [callError, partner]);

  useEffect(() => {
    const handleWindowResize = () => {
      const overlayElement = overlayRef.current;

      if (!overlayElement) {
        return;
      }

      const maxX = Math.max(window.innerWidth - overlayElement.offsetWidth - 12, 0);
      const maxY = Math.max(window.innerHeight - overlayElement.offsetHeight - 12, 0);

      setPosition((currentPosition) => ({
        x: Math.min(Math.max(currentPosition.x, 0), maxX),
        y: Math.min(Math.max(currentPosition.y, 0), maxY),
      }));
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      if (!overlayRef.current) {
        return;
      }

      const deltaX = event.clientX - dragStateRef.current.startX;
      const deltaY = event.clientY - dragStateRef.current.startY;
      const maxX = Math.max(window.innerWidth - overlayRef.current.offsetWidth - 20, 0);
      const maxY = Math.max(window.innerHeight - overlayRef.current.offsetHeight - 20, 0);

      setPosition({
        x: Math.min(Math.max(dragStateRef.current.initialX + deltaX, 0), maxX),
        y: Math.min(Math.max(dragStateRef.current.initialY + deltaY, 0), maxY),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (event) => {
    if (window.innerWidth < 640 || !overlayRef.current) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      initialX: position.x,
      initialY: position.y,
    };

    setIsDragging(true);
  };

  if (!incomingCall && !activeCall && !callError) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[80] flex justify-center sm:inset-0 sm:block">
      <div
        ref={overlayRef}
        className="pointer-events-auto w-full max-w-sm rounded-[1.75rem] border p-4 shadow-[0_24px_60px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:absolute"
        style={{
          borderColor: "var(--panel-border)",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(30,41,59,0.9))",
          transform: `translate(${position.x}px, ${position.y}px)`,
          right: "20px",
          top: "20px",
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        <div
          className="mb-3 hidden items-center justify-center sm:flex"
          onMouseDown={handleDragStart}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className="h-1.5 w-14 rounded-full bg-white/20" />
        </div>
        {partner ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-bold text-slate-950">
                {(partner.name || partner.email || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {partner.name || "Friend"}
                </p>
                <p className="truncate text-xs text-slate-300">
                  {partner.email || statusLabel}
                </p>
              </div>
              {partner.id ? (
                <button
                  type="button"
                  onClick={() => navigate(`/friends/${partner.id}`)}
                  className="rounded-full border px-3 py-2 text-[11px] font-semibold text-cyan-200"
                  style={{ borderColor: "rgba(148,163,184,0.24)" }}
                >
                  Open Chat
                </button>
              ) : null}
            </div>

            <div className="mt-3 rounded-2xl border px-3 py-2 text-xs text-slate-200"
              style={{ borderColor: "rgba(148,163,184,0.16)", background: "rgba(255,255,255,0.04)" }}
            >
              {statusLabel}
            </div>

            <div className="mt-4 flex items-center gap-2">
              {incomingCall ? (
                <>
                  <button
                    type="button"
                    onClick={declineIncomingCall}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
                    style={{ background: "rgba(239,68,68,0.92)" }}
                  >
                    <IconPhoneOff className="h-4 w-4" />
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={acceptIncomingCall}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-slate-950"
                    style={{ background: "linear-gradient(135deg,#67e8f9,#3b82f6)" }}
                  >
                    <IconPhone className="h-4 w-4" />
                    Accept
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold text-white"
                    style={{
                      borderColor: "rgba(148,163,184,0.2)",
                      background: isMuted ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <IconMicOff className="h-4 w-4" />
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    type="button"
                    onClick={() => endCall(true)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
                    style={{ background: "rgba(239,68,68,0.92)" }}
                  >
                    <IconPhoneOff className="h-4 w-4" />
                    End Call
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-200">{callError}</p>
            <button
              type="button"
              onClick={() => endCall(false)}
              className="rounded-full border px-3 py-2 text-xs font-semibold text-white"
              style={{ borderColor: "rgba(148,163,184,0.22)" }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceCallOverlay;
