import { useCallback, useEffect, useState } from "react";
import { messageService } from "../services/messageService.js";
import { useSocketContext } from "../contexts/SocketContext.jsx";
import { SOCKET_EVENTS } from "../utils/constants.js";

export const useMessages = (partnerId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const { socketService } = useSocketContext();

  const loadMessages = useCallback(async () => {
    if (!partnerId) return;

    setLoading(true);

    try {
      const data = await messageService.getConversation(partnerId);
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!partnerId) return;

    const onMessage = (msg) => {
      const senderId = msg.sender._id || msg.sender;
      const receiverId = msg.receiver._id || msg.receiver;

      const belongsToConversation =
        (senderId === partnerId && receiverId === currentUserId) ||
        (senderId === currentUserId && receiverId === partnerId);

      if (!belongsToConversation) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      // Receiver opened the chat
      if (receiverId === currentUserId) {
        messageService.markSeen(msg._id).catch(console.error);
      }
    };

    const onEdit = (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    };

    const onDelete = (msg) => {
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
    };

    // const onDelivered = (msg) => {
    //    console.log("MESSAGE_DELIVERED RECEIVED:", msg);
    //   setMessages((prev) =>
    //     prev.map((m) => (m._id === msg._id ? { ...m, ...msg } : m)),
    //   );
    // };
const onDelivered = (msg) => {
  setMessages((prev) => {
    console.log("Incoming ID:", msg._id);

    console.log(
      "Current IDs:",
      prev.map((m) => m._id),
    );

    const updated = prev.map((m) => (m._id === msg._id ? { ...m, ...msg } : m));

    return updated;
  });
};
   const onSeen = (data) => {
     console.log("MESSAGE_SEEN RECEIVED:", data);

     const updatedMessages = Array.isArray(data) ? data : [data];

     setMessages((prev) =>
       prev.map((message) => {
         const updated = updatedMessages.find((m) => m._id === message._id);

         return updated || message;
       }),
     );
   };

    const onTyping = ({ userId }) => {
      if (userId === partnerId) {
        setTypingUser(userId);
      }
    };

    const onStopTyping = ({ userId }) => {
      if (userId === partnerId) {
        setTypingUser(null);
      }
    };

    const unsub1 = socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, onMessage);

    const unsub2 = socketService.on(SOCKET_EVENTS.MESSAGE_EDIT, onEdit);

    const unsub3 = socketService.on(SOCKET_EVENTS.MESSAGE_DELETE, onDelete);

    const unsub4 = socketService.on(
      SOCKET_EVENTS.MESSAGE_DELIVERED,
      onDelivered,
    );

    const unsub5 = socketService.on(SOCKET_EVENTS.MESSAGE_SEEN, onSeen);

    const unsub6 = socketService.on(SOCKET_EVENTS.TYPING, onTyping);

    const unsub7 = socketService.on(SOCKET_EVENTS.STOP_TYPING, onStopTyping);

    return () => {
      unsub1?.();
      unsub2?.();
      unsub3?.();
      unsub4?.();
      unsub5?.();
      unsub6?.();
      unsub7?.();
    };
  }, [partnerId, currentUserId, socketService]);

  const sendMessage = (text, replyTo = null) => {
    const payload = {
      receiverId: partnerId,
      text,
      replyTo: replyTo?._id || replyTo || null,
    };
console.log("Sending payload:", payload);
    socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, payload, (res) => {
      if (!res?.success) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) {
          return prev;
        }

        return [...prev, res.data];
      });
    });
  };

  const emitTyping = () => {
    socketService.emit(SOCKET_EVENTS.TYPING, {
      receiverId: partnerId,
    });
  };

  const emitStopTyping = () => {
    socketService.emit(SOCKET_EVENTS.STOP_TYPING, {
      receiverId: partnerId,
    });
  };

  return {
    messages,
    loading,
    typingUser,
    sendMessage,
    emitTyping,
    emitStopTyping,
    reload: loadMessages,
  };
};
