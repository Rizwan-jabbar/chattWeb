import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { saveVoiceCallHistory } from "../rtk/thunks/messageThunk/messageThunk";
import { sendNotificationThunk } from "../rtk/thunks/notificationThunk/notificationThunk";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace(/\/api$/, "");
const OUTGOING_CALL_TIMEOUT_MS = 120000;

const rtcConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const initialIncomingCall = null;
const initialActiveCall = null;

function useVoiceCallManager(user) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const partnerIdRef = useRef(null);
  const durationTimerRef = useRef(null);
  const outgoingCallTimeoutRef = useRef(null);
  const activeCallRef = useRef(null);
  const callStatusRef = useRef("idle");
  const callDurationRef = useRef(0);

  const [socketConnected, setSocketConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState(initialIncomingCall);
  const [activeCall, setActiveCall] = useState(initialActiveCall);
  const [callStatus, setCallStatus] = useState("idle");
  const [callError, setCallError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const clearDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      window.clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const clearOutgoingCallTimeout = useCallback(() => {
    if (outgoingCallTimeoutRef.current) {
      window.clearTimeout(outgoingCallTimeoutRef.current);
      outgoingCallTimeoutRef.current = null;
    }
  }, []);

  const startDurationTimer = useCallback(() => {
    clearDurationTimer();
    setCallDuration(0);
    durationTimerRef.current = window.setInterval(() => {
      setCallDuration((previousDuration) => previousDuration + 1);
    }, 1000);
  }, [clearDurationTimer]);

  const releaseMediaResources = useCallback(() => {
    clearDurationTimer();
    clearOutgoingCallTimeout();

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    partnerIdRef.current = null;
    setIsMuted(false);
  }, [clearDurationTimer, clearOutgoingCallTimeout]);

  const resetCallState = useCallback(() => {
    releaseMediaResources();
    setIncomingCall(initialIncomingCall);
    setActiveCall(initialActiveCall);
    setCallStatus("idle");
    setCallError("");
    setCallDuration(0);
  }, [releaseMediaResources]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && partnerIdRef.current) {
        socketRef.current.emit("call:ice-candidate", {
          toUserId: partnerIdRef.current,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;

      if (remoteAudioRef.current && remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current
          .play()
          .catch(() => null);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      const currentConnectionState = peerConnection.connectionState;

      if (currentConnectionState === "connected") {
        setCallStatus("connected");
        setCallError("");
        startDurationTimer();
      }

      if (["failed", "disconnected", "closed"].includes(currentConnectionState)) {
        resetCallState();
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [resetCallState, startDurationTimer]);

  const prepareLocalStream = useCallback(async () => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = userMedia;
    setIsMuted(false);
    return userMedia;
  }, []);

  const attachLocalTracks = useCallback((peerConnection, stream) => {
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
  }, []);

  const endCall = useCallback(
    async (notifyPeer = true, nextError = "") => {
      const shouldSaveHistory =
        activeCallRef.current &&
        activeCallRef.current.direction === "outgoing" &&
        callDurationRef.current > 0 &&
        callStatusRef.current === "connected";

      const partnerId = partnerIdRef.current;

      if (notifyPeer && socketRef.current && partnerIdRef.current) {
        socketRef.current.emit("call:end", {
          toUserId: partnerIdRef.current,
        });
      }

      releaseMediaResources();
      setIncomingCall(initialIncomingCall);
      setActiveCall(initialActiveCall);
      setCallStatus("idle");
      setCallDuration(0);
      setCallError(nextError);

      if (shouldSaveHistory && partnerId) {
        try {
          await dispatch(
            saveVoiceCallHistory({
              recipientId: partnerId,
              duration: callDurationRef.current,
            })
          ).unwrap();
        } catch (_error) {
          return;
        }
      }
    },
    [dispatch, releaseMediaResources]
  );

  const saveOutgoingCallHistory = useCallback(
    async ({ partnerId, status, notifyReceiver = false }) => {
      if (!partnerId) {
        return;
      }

      try {
        await dispatch(
          saveVoiceCallHistory({
            recipientId: partnerId,
            duration: 0,
            status,
          })
        ).unwrap();

        if (notifyReceiver) {
          await dispatch(
            sendNotificationThunk({
              recipientId: partnerId,
              content: `You missed a call from ${user?.username || user?.email || "someone"}.`,
            })
          ).unwrap();
        }
      } catch (_error) {
        return;
      }
    },
    [dispatch, user?.email, user?.username]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user?._id || !token) {
      resetCallState();
      return undefined;
    }

    const socketConnection = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socketConnection;

    socketConnection.on("connect", () => {
      setSocketConnected(true);
      setCallError("");
    });

    socketConnection.on("disconnect", () => {
      setSocketConnected(false);
    });

    socketConnection.on("call:incoming", ({ fromUserId, fromUserName, fromUserEmail, offer }) => {
      if (activeCallRef.current) {
        socketConnection.emit("call:decline", { toUserId: fromUserId });
        return;
      }

      setIncomingCall({
        fromUserId,
        fromUserName: fromUserName || fromUserEmail || "Friend",
        fromUserEmail: fromUserEmail || "",
        offer,
      });
      setCallStatus("incoming");
      setCallError("");
    });

    socketConnection.on("call:accepted", async ({ byUserId, answer }) => {
      try {
        if (!peerConnectionRef.current) {
          return;
        }

        clearOutgoingCallTimeout();
        partnerIdRef.current = byUserId;
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setCallStatus("ringing");
      } catch (_error) {
        endCall(false, "Unable to connect this call.");
      }
    });

    socketConnection.on("call:declined", () => {
      clearOutgoingCallTimeout();
      const currentCall = activeCallRef.current;
      const currentPartnerId = partnerIdRef.current;
      const shouldSaveDeclinedHistory =
        currentCall?.direction === "outgoing" &&
        ["calling", "connecting", "ringing"].includes(callStatusRef.current) &&
        currentPartnerId;

      if (shouldSaveDeclinedHistory) {
        saveOutgoingCallHistory({
          partnerId: currentPartnerId,
          status: "declined",
        });
      }

      endCall(false, "The call was declined.");
    });

    socketConnection.on("call:ended", () => {
      clearOutgoingCallTimeout();
      endCall(false);
    });

    socketConnection.on("call:unavailable", ({ message }) => {
      clearOutgoingCallTimeout();
      endCall(false, message || "This user is not available right now.");
    });

    socketConnection.on("call:ice-candidate", async ({ candidate }) => {
      try {
        if (!candidate || !peerConnectionRef.current) {
          return;
        }

        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (_error) {
        setCallError("Network connection for this call is unstable.");
      }
    });

    return () => {
      socketConnection.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
      resetCallState();
    };
  }, [clearOutgoingCallTimeout, endCall, resetCallState, saveOutgoingCallHistory, user?._id]);

  const startCall = useCallback(
    async ({ recipientId, recipientName, recipientEmail }) => {
      if (!socketRef.current?.connected) {
        setCallError("Call service is not connected yet.");
        return false;
      }

      if (!recipientId) {
        setCallError("Unable to identify this user for a call.");
        return false;
      }

      try {
        setCallError("");
        setIncomingCall(initialIncomingCall);
        setCallStatus("connecting");

        const localStream = await prepareLocalStream();
        const peerConnection = createPeerConnection();
        attachLocalTracks(peerConnection, localStream);

        partnerIdRef.current = recipientId;
        setActiveCall({
          partnerId: recipientId,
          partnerName: recipientName || recipientEmail || "Friend",
          partnerEmail: recipientEmail || "",
          direction: "outgoing",
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current.emit("call:start", {
          toUserId: recipientId,
          offer,
          fromUserName: user?.username || user?.email || "User",
          fromUserEmail: user?.email || "",
        });

        clearOutgoingCallTimeout();
        outgoingCallTimeoutRef.current = window.setTimeout(async () => {
          const currentCall = activeCallRef.current;
          const currentPartnerId = partnerIdRef.current;
          const isStillWaitingForAnswer =
            currentCall?.direction === "outgoing" &&
            ["calling", "connecting", "ringing"].includes(callStatusRef.current);

          if (!isStillWaitingForAnswer || !currentPartnerId) {
            return;
          }

          await saveOutgoingCallHistory({
            partnerId: currentPartnerId,
            status: "missed",
            notifyReceiver: true,
          });
          endCall(true, "No answer received. Call marked as missed.");
        }, OUTGOING_CALL_TIMEOUT_MS);

        setCallStatus("calling");
        return true;
      } catch (_error) {
        setCallError("Microphone access is required to start a call.");
        endCall(false);
        return false;
      }
    },
    [
      attachLocalTracks,
      clearOutgoingCallTimeout,
      createPeerConnection,
      endCall,
      prepareLocalStream,
      saveOutgoingCallHistory,
      user?.email,
      user?.username,
    ]
  );

  const acceptIncomingCall = useCallback(async () => {
    if (!incomingCall || !socketRef.current?.connected) {
      return false;
    }

    try {
      setCallError("");
      setCallStatus("connecting");

      const localStream = await prepareLocalStream();
      const peerConnection = createPeerConnection();
      attachLocalTracks(peerConnection, localStream);

      partnerIdRef.current = incomingCall.fromUserId;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current.emit("call:accept", {
        toUserId: incomingCall.fromUserId,
        answer,
      });

      setActiveCall({
        partnerId: incomingCall.fromUserId,
        partnerName: incomingCall.fromUserName,
        partnerEmail: incomingCall.fromUserEmail,
        direction: "incoming",
      });
      setIncomingCall(initialIncomingCall);
      setCallStatus("ringing");
      return true;
    } catch (_error) {
      setCallError("Unable to answer this call right now.");
      endCall(false);
      return false;
    }
  }, [
    attachLocalTracks,
    createPeerConnection,
    endCall,
    incomingCall,
    prepareLocalStream,
  ]);

  const declineIncomingCall = useCallback(() => {
    if (incomingCall?.fromUserId && socketRef.current?.connected) {
      socketRef.current.emit("call:decline", {
        toUserId: incomingCall.fromUserId,
      });
    }

    setIncomingCall(initialIncomingCall);
    setCallStatus("idle");
  }, [incomingCall]);

  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) {
      return;
    }

    const nextMutedState = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !nextMutedState;
    });
    setIsMuted(nextMutedState);
  }, [isMuted]);

  return useMemo(
    () => ({
      socketConnected,
      incomingCall,
      activeCall,
      callStatus,
      callError,
      isMuted,
      callDuration,
      remoteAudioRef,
      startCall,
      acceptIncomingCall,
      declineIncomingCall,
      endCall,
      toggleMute,
      clearCallError: () => setCallError(""),
      isCallActive: Boolean(activeCall),
    }),
    [
      acceptIncomingCall,
      activeCall,
      callDuration,
      callError,
      callStatus,
      declineIncomingCall,
      endCall,
      incomingCall,
      isMuted,
      socketConnected,
      startCall,
      toggleMute,
    ]
  );
}

export default useVoiceCallManager;
