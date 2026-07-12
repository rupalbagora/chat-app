import { formatTime } from "../utils/formatTime.js";
import OnlineBadge from "./OnlineBadge.jsx";
import SearchBar from "./SearchBar.jsx";
export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectUser,
  currentUser,
}) {
  const showSearchResults = searchQuery.length >= 2;

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="avatar avatar--lg">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.username} />
          ) : (
            <span>{currentUser?.username?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <h1>Chats</h1>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search users or messages"
      />

      <div className="sidebar__list">
        {showSearchResults ? (
          searchResults.length === 0 ? (
            <p className="sidebar__empty">No users found</p>
          ) : (
            searchResults.map((user) => (
              <button
                key={user._id}
                type="button"
                className="sidebar__item"
                onClick={() => onSelectUser(user)}
              >
                <div className="avatar">
                  <span>{user.username[0].toUpperCase()}</span>
                  <OnlineBadge online={user.online} />
                </div>
                <div className="sidebar__item-content">
                  <strong>{user.username}</strong>
                  <span className="sidebar__item-preview">{user.email}</span>
                </div>
              </button>
            ))
          )
        ) : conversations.length === 0 ? (
          <p className="sidebar__empty">No conversations yet. Search for users to start chatting.</p>
        ) : (
          conversations.map(({ partner, lastMessage, unreadCount }) => (
            <button
              key={partner._id}
              type="button"
              className={`sidebar__item ${activeId === partner._id ? "sidebar__item--active" : ""}`}
              onClick={() => onSelect(partner)}
            >
              <div className="avatar">
                <span>{partner.username[0].toUpperCase()}</span>
                <OnlineBadge online={partner.online} />
              </div>
              <div className="sidebar__item-content">
                <div className="sidebar__item-top">
                  <strong>{partner.username}</strong>
                  {lastMessage && (
                    <time>{formatTime(lastMessage.createdAt)}</time>
                  )}
                </div>
                <div className="sidebar__item-bottom">
                  <span className="sidebar__item-preview">
                    {lastMessage?.text || "No messages"}
                  </span>
                  {unreadCount > 0 && (
                    <span className="sidebar__badge">{unreadCount}</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
