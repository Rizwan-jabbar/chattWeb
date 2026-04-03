import jwt from "jsonwebtoken";

const connectedUsers = new Map();

const addUserSocket = (userId, socketId) => {
  const normalizedUserId = String(userId);
  const existingSockets = connectedUsers.get(normalizedUserId) || new Set();
  existingSockets.add(socketId);
  connectedUsers.set(normalizedUserId, existingSockets);
};

const removeUserSocket = (userId, socketId) => {
  const normalizedUserId = String(userId);
  const existingSockets = connectedUsers.get(normalizedUserId);

  if (!existingSockets) {
    return;
  }

  existingSockets.delete(socketId);

  if (existingSockets.size === 0) {
    connectedUsers.delete(normalizedUserId);
    return;
  }

  connectedUsers.set(normalizedUserId, existingSockets);
};

const emitToUser = (io, userId, eventName, payload) => {
  const normalizedUserId = String(userId);
  const targetSockets = connectedUsers.get(normalizedUserId);

  if (!targetSockets?.size) {
    return false;
  }

  targetSockets.forEach((socketId) => {
    io.to(socketId).emit(eventName, payload);
  });

  return true;
};

export const initializeVoiceCallSocket = (io) => {
  io.use((socket, next) => {
    const bearerToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

    if (!bearerToken) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      socket.userId = String(decoded.userId);
      return next();
    } catch (_error) {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    addUserSocket(socket.userId, socket.id);
    socket.emit("call:ready", { userId: socket.userId });

    socket.on("call:start", ({ toUserId, offer, fromUserName, fromUserEmail }) => {
      const isUserAvailable = emitToUser(io, toUserId, "call:incoming", {
        fromUserId: socket.userId,
        fromUserName,
        fromUserEmail,
        offer,
        callType: "audio",
      });

      if (!isUserAvailable) {
        socket.emit("call:unavailable", {
          toUserId,
          message: "This user is not available for a call right now.",
        });
      }
    });

    socket.on("call:accept", ({ toUserId, answer }) => {
      emitToUser(io, toUserId, "call:accepted", {
        byUserId: socket.userId,
        answer,
      });
    });

    socket.on("call:decline", ({ toUserId }) => {
      emitToUser(io, toUserId, "call:declined", {
        byUserId: socket.userId,
      });
    });

    socket.on("call:end", ({ toUserId }) => {
      emitToUser(io, toUserId, "call:ended", {
        byUserId: socket.userId,
      });
    });

    socket.on("call:ice-candidate", ({ toUserId, candidate }) => {
      emitToUser(io, toUserId, "call:ice-candidate", {
        fromUserId: socket.userId,
        candidate,
      });
    });

    socket.on("disconnect", () => {
      removeUserSocket(socket.userId, socket.id);
    });
  });
};
