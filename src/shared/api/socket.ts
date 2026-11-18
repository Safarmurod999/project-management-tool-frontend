import { io, type Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

let socket: Socket | null = null;

/**
 * Single shared Socket.IO connection to the backend RealtimeGateway.
 * The token is read on every (re)connect, so refreshed tokens are picked up.
 */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: false,
      withCredentials: true,
      auth: (cb) => cb({ token: localStorage.getItem("access_token") ?? "" }),
    });
  }

  if (!socket.connected && !socket.active) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
