import { formatLastSeen } from "../utils/formatTime.js";
import OnlineBadge from "./OnlineBadge.jsx";

export default function Header({ partner, onBack, onProfile }) {
  return (
    <header className="chat-header">
      {onBack && (
        <button type="button" className="chat-header__back" onClick={onBack}>
          ←
        </button>
      )}
      <button type="button" className="chat-header__profile" onClick={onProfile}>
        <div className="avatar">
          {partner?.avatar ? (
            <img src={partner.avatar} alt={partner.username} />
          ) : (
            <span>{partner?.username?.[0]?.toUpperCase()}</span>
          )}
          <OnlineBadge online={partner?.online} />
        </div>
        <div>
          <h2>{partner?.username}</h2>
          <p className="chat-header__status">
            {partner?.online ? "online" : `last seen ${formatLastSeen(partner?.lastSeen)}`}
          </p>
        </div>
      </button>
    </header>
  );
}
