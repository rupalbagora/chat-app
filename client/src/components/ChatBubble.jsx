import { formatTime } from "../utils/formatTime.js";
import MessageStatus from "./MessageStatus.jsx";

export default function ChatBubble({
  message,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  editingMessage,
  setEditingMessage,
}) {
  const reply = message.replyTo;
  console.log(message.replyTo);
  return (
    <div
      className={`chat-bubble ${isOwn ? "chat-bubble--own" : "chat-bubble--other"}`}
    >
      {reply && typeof reply === "object" && (
        <div className="chat-bubble__reply">
          <strong>{reply.sender?.username || "User"}</strong>
          <p>{reply.text}</p>
        </div>
      )}
      <p className="chat-bubble__text">
        {message.deleted ? (
          <em className="chat-bubble__deleted">{message.text}</em>
        ) : (
          message.text
        )}
        {message.edited && !message.deleted && (
          <span className="chat-bubble__edited"> edited</span>
        )}
      </p>
      <div className="chat-bubble__meta">
        <span>{formatTime(message.createdAt)}</span>
        <MessageStatus message={message} isOwn={isOwn} />

        {!message.deleted && (
          <>
            {!isOwn ? (
              <button
                className="chat-bubble__reply-btn"
                onClick={() => onReply?.(message)}
              >
                Reply
              </button>
            ) : (
              <>
                <button
                  className="chat-bubble__reply-btn"
                  onClick={() => onEdit?.(message)}
                >
                  Edit
                </button>

                <button
                  className="chat-bubble__reply-btn"
                  onClick={() => onDelete?.(message)}
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
