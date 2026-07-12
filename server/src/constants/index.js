export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
};

export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  SEEN: "seen",
};

export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN: "join",
  SEND_MESSAGE: "sendMessage",
  MESSAGE_RECEIVED: "messageReceived",
  TYPING: "typing",
  STOP_TYPING: "stopTyping",
  MESSAGE_SEEN: "messageSeen",
  MESSAGE_DELIVERED: "messageDelivered",
  MESSAGE_EDIT: "messageEdit",
  MESSAGE_DELETE: "messageDelete",
  USER_ONLINE: "userOnline",
  USER_OFFLINE: "userOffline",
  ERROR: "error",
};
