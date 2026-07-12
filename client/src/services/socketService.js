import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../utils/constants.js";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket = null;

export const socketService = {
  connect: (token) => {
    if (socket?.connected) return socket;

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      socket.emit(SOCKET_EVENTS.JOIN);
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  emit: (event, data, callback) => {
    socket?.emit(event, data, callback);
  },

  on: (event, handler) => {
    socket?.on(event, handler);
    return () => socket?.off(event, handler);
  },

  off: (event, handler) => {
    socket?.off(event, handler);
  },
};
