export default function TypingIndicator({ username }) {
  if (!username) return null;
  return (
    <div className="typing-indicator">
      <span>{username} is typing</span>
      <span className="typing-indicator__dots">
        <span /><span /><span />
      </span>
    </div>
  );
}
