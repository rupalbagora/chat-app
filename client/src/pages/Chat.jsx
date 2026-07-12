import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useMessages } from "../hooks/useMessages.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { messageService } from "../services/messageService.js";
import { userService } from "../services/userService.js";
import Modal from "../components/Modal.jsx";
import { useSocketContext } from "../contexts/SocketContext.jsx";
import { SOCKET_EVENTS } from "../utils/constants.js";
import { scrollToBottom } from "../utils/scrollToBottom.js";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import Loader from "../components/Loader.jsx";

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { socketService } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
const [editingMessage, setEditingMessage] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [messageToDelete, setMessageToDelete] = useState(null);
  const {
    messages,
    loading,
    typingUser,
    sendMessage,
    emitTyping,
    emitStopTyping,
  } = useMessages(activePartner?._id, user?._id);

  const loadConversations = async () => {
    const data = await messageService.getRecentConversations();
    setConversations(data);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // useEffect(() => {
  //   scrollToBottom(messagesEndRef);
  // }, [messages, typingUser]);
useEffect(() => {
  scrollToBottom(messagesEndRef, false);
}, [messages.length]);
  useEffect(() => {
    const onMessage = () => loadConversations();
    const onOnline = ({ userId, username }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.partner._id === userId
            ? { ...c, partner: { ...c.partner, online: true, username } }
            : c
        )
      );
      if (activePartner?._id === userId) {
        setActivePartner((p) => ({ ...p, online: true }));
      }
    };
    const onOffline = ({ userId, lastSeen }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.partner._id === userId
            ? { ...c, partner: { ...c.partner, online: false, lastSeen } }
            : c
        )
      );
      if (activePartner?._id === userId) {
        setActivePartner((p) => ({ ...p, online: false, lastSeen }));
      }
    };

    const u1 = socketService.on(SOCKET_EVENTS.MESSAGE_RECEIVED, onMessage);
    const u2 = socketService.on(SOCKET_EVENTS.USER_ONLINE, onOnline);
    const u3 = socketService.on(SOCKET_EVENTS.USER_OFFLINE, onOffline);

    return () => {
      u1?.();
      u2?.();
      u3?.();
    };
  }, [activePartner, socketService]);

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }
    userService.searchUsers(debouncedSearch).then(setSearchResults);
  }, [debouncedSearch]);

  const handleSelectPartner = (partner) => {
    setActivePartner(partner);
    setReplyTo(null);
  };

  const handleSelectUser = (foundUser) => {
    setActivePartner(foundUser);
    setSearchQuery("");
    setSearchResults([]);
  };

  // const handleSend = (text, replyId) => {
  //   sendMessage(text, replyId || replyTo?._id);
  //   setReplyTo(null);
  //   loadConversations();
  // };
  const handleSend = (text, replyId) => {
    console.log("replyId:", replyId);
    console.log("replyTo state:", replyTo);

    sendMessage(text, replyId || replyTo?._id);
    setReplyTo(null);
    loadConversations();
  };
  const handleEdit = (message) => {
    setEditingMessage(message);
  };
const handleDelete = (message) => {
  setMessageToDelete(message);
  setShowDeleteModal(true);
};
  return (
    <div className="chat-page">
      <Sidebar
        conversations={conversations}
        activeId={activePartner?._id}
        onSelect={handleSelectPartner}
        searchQuery={searchQuery}
        onSearchChange={(val) => setSearchQuery(val)}
        searchResults={searchResults}
        onSelectUser={handleSelectUser}
        currentUser={user}
      />

      <main className="chat-main">
        {!activePartner ? (
          <div className="chat-empty">
            <h2>Welcome, {user?.username}</h2>
            <p>Select a chat or search for users to start messaging.</p>
            <div className="chat-empty__actions">
              <button type="button" onClick={() => navigate("/profile")}>
                Profile
              </button>
              <button type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Header
              partner={activePartner}
              onProfile={() => navigate("/profile")}
            />
            {/* <div className="chat-messages" ref={messagesEndRef}> */}
            <div className="chat-messages">
              {loading ? (
                <Loader />
              ) : (
                messages.map((msg) => {
                  const senderId = msg.sender._id || msg.sender;

                  return (
                    <ChatBubble
                      key={msg._id}
                      message={msg}
                      isOwn={senderId === user._id}
                      onReply={setReplyTo}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      editingMessage={editingMessage}
                      setEditingMessage={setEditingMessage}
                    />
                  );
                })
              )}

              {typingUser && (
                <TypingIndicator username={activePartner.username} />
              )}

              {/* Scroll target */}
              <div ref={messagesEndRef} />
            </div>
            <Modal
              open={showDeleteModal}
              title="Delete Message"
              onClose={() => setShowDeleteModal(false)}
            >
              <p>Are you sure you want to delete this message?</p>

              <div className="modal-actions">
                <button onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>

                <button
                  className="danger"
                  onClick={async () => {
                    await messageService.deleteMessage(messageToDelete._id);
                    setShowDeleteModal(false);
                    setMessageToDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </Modal>
            <ChatInput
              onSend={handleSend}
              onTyping={emitTyping}
              onStopTyping={emitStopTyping}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
            />
          </>
        )}
      </main>
    </div>
  );
}
