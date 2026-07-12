import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { userService } from "../services/userService.js";
import { useTheme } from "../contexts/ThemeContext.jsx";
import Loader from "../components/Loader.jsx";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const updated = await userService.updateProfile(form);
      updateUser(updated);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <button type="button" className="profile-back" onClick={() => navigate("/")}>
          ← Back to chats
        </button>

        <div className="avatar avatar--xl">
          <span>{user?.username?.[0]?.toUpperCase()}</span>
        </div>

        <h1>{user?.username}</h1>
        <p className="profile-email">{user?.email}</p>

        {message && <div className="profile-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Bio
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={150}
              rows={3}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? <Loader size="sm" /> : "Save Changes"}
          </button>
        </form>

        <div className="profile-actions">
          <button type="button" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
          <button type="button" className="profile-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
