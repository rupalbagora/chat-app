import { useEffect, useRef, useState } from "react";
import { messageService } from "../services/messageService.js";
export default function ChatInput({
  onSend,
  onTyping,
  onStopTyping,
  replyTo,
  onCancelReply,
  editingMessage,
  setEditingMessage,
}) {
  const [text, setText] = useState("");
  const typingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping?.();
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      typingRef.current = false;
      onStopTyping?.();
    }, 1000);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const trimmed = text.trim();
  //   console.log("ChatInput replyTo:", replyTo);
  //   if (!trimmed) return;
  //   onSend(trimmed, replyTo?._id || null);
  //   setText("");
  //   onCancelReply?.();
  //   onStopTyping?.();
  //   typingRef.current = false;
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    // Edit mode
    if (editingMessage) {
      await messageService.editMessage(editingMessage._id, trimmed);

      setEditingMessage(null);
      setText("");
      return;
    }

    // Send new message
    onSend(trimmed, replyTo?._id || null);

    setText("");
    onCancelReply?.();
    onStopTyping?.();
    typingRef.current = false;
  };
  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      {editingMessage && (
        <div className="chat-input__reply-preview">
          <div>
            <strong>Editing message</strong>
            <p>{editingMessage.text}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingMessage(null);
              setText("");
            }}
          >
            ×
          </button>
        </div>
      )}
      {replyTo && (
        <div className="chat-input__reply-preview">
          <div>
            <strong>Replying to {replyTo.sender?.username || "User"}</strong>
            <p>{replyTo.text}</p>
          </div>
          <button type="button" onClick={onCancelReply}>
            ×
          </button>
        </div>
      )}
      <div className="chat-input__row">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={handleChange}
          autoComplete="off"
        />
        <button type="submit" disabled={!text.trim()}>
          {editingMessage ? "Save" : "Send"}
        </button>
      </div>
    </form>
  );
}
