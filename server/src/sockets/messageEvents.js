import { SOCKET_EVENTS } from "../constants/index.js";
import { messageService } from "../services/messageService.js";
import { messageRepository } from "../repositories/messageRepository.js";
import { getIO } from "../config/socket.js";

export const registerMessageEvents = (socket) => {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload, callback) => {
    try {
      const message = await messageService.sendMessage({
        senderId: socket.user._id.toString(),
        receiverId: payload.receiverId,
        text: payload.text,
        type: payload.type,
        replyTo: payload.replyTo,
      });

      // First return the message to the sender
      callback?.({
        success: true,
        data: message,
      });

      // Then mark it delivered
      const delivered = await messageRepository.markDelivered(message._id);

      // Notify the sender that the receiver got it
      getIO()
        .to(`user:${socket.user._id}`)
        .emit(SOCKET_EVENTS.MESSAGE_DELIVERED, delivered);
    } catch (error) {
      callback?.({
        success: false,
        message: error.message,
      });
    }
  });
  // socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload, callback) => {
  //   try {
  //     const message = await messageService.sendMessage({
  //       senderId: socket.user._id.toString(),
  //       receiverId: payload.receiverId,
  //       text: payload.text,
  //       type: payload.type,
  //       replyTo: payload.replyTo,
  //     });
  //     callback?.({ success: true, data: message });
  //   } catch (error) {
  //     callback?.({ success: false, message: error.message });
  //   }
  // });

  socket.on(SOCKET_EVENTS.TYPING, ({ receiverId }) => {
    const io = getIO();
    io.to(`user:${receiverId}`).emit(SOCKET_EVENTS.TYPING, {
      userId: socket.user._id.toString(),
      username: socket.user.username,
    });
  });

  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ receiverId }) => {
    const io = getIO();
    io.to(`user:${receiverId}`).emit(SOCKET_EVENTS.STOP_TYPING, {
      userId: socket.user._id.toString(),
    });
  });

  socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async ({ messageId }, callback) => {
    try {
      const message = await messageService.markSeen(
        socket.user._id.toString(),
        messageId
      );
      callback?.({ success: true, data: message });
    } catch (error) {
      callback?.({ success: false, message: error.message });
    }
  });
};
