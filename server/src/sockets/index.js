import { registerMessageEvents } from "./messageEvents.js";
import { registerUserEvents } from "./userEvents.js";
import { socketAuthMiddleware } from "./socketMiddleware.js";

export const initSocketHandlers = (io) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    registerUserEvents(socket);
    registerMessageEvents(socket);
  });
};
