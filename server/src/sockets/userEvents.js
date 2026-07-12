import { SOCKET_EVENTS } from "../constants/index.js";
import { userService } from "../services/userService.js";
import { getIO } from "../config/socket.js";

export const registerUserEvents = (socket) => {
  socket.on(SOCKET_EVENTS.JOIN, async () => {
    const userId = socket.user._id.toString();
    socket.join(`user:${userId}`);
    console.log(socket.rooms);

    // await userService.setOnline(userId, socket.id);
    await userService.setOnline(userId);

    const io = getIO();
    io.emit(SOCKET_EVENTS.USER_ONLINE, {
      userId,
      username: socket.user.username,
    });
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
    const userId = socket.user._id.toString();
    await userService.setOffline(userId);

    const io = getIO();
    io.emit(SOCKET_EVENTS.USER_OFFLINE, {
      userId,
      lastSeen: new Date(),
    });
  });
};
