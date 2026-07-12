import { getIO } from "../config/socket.js";
import { MESSAGE_STATUS, SOCKET_EVENTS } from "../constants/index.js";
import { messageRepository } from "../repositories/messageRepository.js";
import { userRepository } from "../repositories/userRepository.js";

export const messageService = {
  sendMessage: async ({ senderId, receiverId, text, type, replyTo }) => {
    const sender = await userRepository.findById(senderId);
    const receiver = await userRepository.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found");
    }

    if (senderId === receiverId) {
      throw new Error("Cannot send message to yourself");
    }

    if (replyTo) {
      const parent = await messageRepository.findById(replyTo);
      if (!parent) {
        throw new Error("Reply message not found");
      }
    }

//     const message = await messageRepository.create({
//       sender: senderId,
//       receiver: receiverId,
//       text,
//       type,
//       replyTo: replyTo || null,
//       status: MESSAGE_STATUS.SENT,
//     });

//     // const io = getIO();
//     // if (receiver.socketId) {
//     //   io.to(receiver.socketId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, message);
//     //   const delivered = await messageRepository.markDelivered(message._id);
//     //   if (sender.socketId) {
//     //     io.to(sender.socketId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, delivered);
//     //   }
//     // }
// const io = getIO();

// const sockets = await io.in(`user:${receiverId}`).fetchSockets();

// if (sockets.length) {
//   io.to(`user:${receiverId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, message);

//   const delivered = await messageRepository.markDelivered(message._id);
// console.log("Delivered message:", delivered);
//   io.to(`user:${senderId}`).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, delivered);
// }
//     return message;
const message = await messageRepository.create({
  sender: senderId,
  receiver: receiverId,
  text,
  type,
  replyTo: replyTo || null,
  status: MESSAGE_STATUS.SENT,
});

const io = getIO();

const sockets = await io.in(`user:${receiverId}`).fetchSockets();

if (sockets.length) {
  io.to(`user:${receiverId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, message);

  const delivered = await messageRepository.markDelivered(message._id);

  io.to(`user:${senderId}`).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, delivered);
}

return message;
  },

  getConversation: async (userId, partnerId, pagination) => {
    const partner = await userRepository.findById(partnerId);
    if (!partner) {
      throw new Error("User not found");
    }

    const messages = await messageRepository.findConversation(
      userId,
      partnerId,
      pagination
    );

   const seenMessages = await messageRepository.markConversationSeen(
     userId,
     partnerId,
   );
   const io = getIO();

   io.to(`user:${partnerId}`).emit(SOCKET_EVENTS.MESSAGE_SEEN, seenMessages);
    return messages.reverse();
  },

  getRecentConversations: async (userId) => {
    return messageRepository.getRecentConversations(userId);
  },

  searchMessages: async (userId, query) => {
    return messageRepository.searchMessages(userId, query);
  },

  editMessage: async (userId, messageId, text) => {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    if (message.sender._id.toString() !== userId) {
      throw new Error("Not authorized to edit this message");
    }
    if (message.deleted) {
      throw new Error("Cannot edit a deleted message");
    }

    const updated = await messageRepository.updateById(messageId, {
      text,
      edited: true,
    });

    const io = getIO();

    io.to(`user:${message.sender._id}`).emit(
      SOCKET_EVENTS.MESSAGE_EDIT,
      updated,
    );

    io.to(`user:${message.receiver._id}`).emit(
      SOCKET_EVENTS.MESSAGE_EDIT,
      updated,
    );

    return updated;
  },

  deleteMessage: async (userId, messageId) => {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    if (message.sender._id.toString() !== userId) {
      throw new Error("Not authorized to delete this message");
    }

    const deleted = await messageRepository.softDelete(messageId);

    const io = getIO();

    io.to(`user:${message.sender._id}`).emit(
      SOCKET_EVENTS.MESSAGE_DELETE,
      deleted,
    );

    io.to(`user:${message.receiver._id}`).emit(
      SOCKET_EVENTS.MESSAGE_DELETE,
      deleted,
    );

    return deleted;
  },

  markSeen: async (userId, messageId) => {
    const message = await messageRepository.findById(messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    if (message.receiver._id.toString() !== userId) {
      throw new Error("Not authorized");
    }

    const updated = await messageRepository.updateById(messageId, {
      seen: true,
      status: MESSAGE_STATUS.SEEN,
    });

    const io = getIO();
    // const sender = await userRepository.findById(message.sender._id);
    // if (sender?.socketId) {
    //   io.to(sender.socketId).emit(SOCKET_EVENTS.MESSAGE_SEEN, updated);
    // }

io.to(`user:${message.sender._id}`).emit(SOCKET_EVENTS.MESSAGE_SEEN, [updated]);
    return updated;
  },
};
