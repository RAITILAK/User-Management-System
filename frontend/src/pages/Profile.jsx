import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
// import { AuthContext } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const roleColors = {
  admin: "#ff4757",
  manager: "#ffa502",
  user: "#00d4ff",
};

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const data = res.data.data || res.data;
        setProfile(data);
        setName(data.name || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (n) =>
    n
      ? n
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const payload = { name };
      if (newPassword) payload.password = newPassword;

      const res = await api.put(`/users/${profile._id}`, payload);
      const updated = res.data.data || res.data;
      setProfile(updated);
      setName(updated.name);
      setNewPassword("");
      setConfirmPassword("");
      updateUser({ name: updated.name });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pf-root {
          min-height: 100vh;
          background-color: #0a0a0f;
          background-image:
            linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          font-family: 'DM Mono', monospace;
          color: #e0e0e0;
        }

        .pf-content {
          max-width: 780px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .pf-page-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
        }

        .pf-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 32px;
        }

        .pf-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
        }

        .pf-card-title {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .pf-profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .pf-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 24px;
          color: #fff;
          flex-shrink: 0;
        }

        .pf-name {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 4px;
        }

        .pf-email {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 10px;
        }

        .pf-badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 500;
        }

        .pf-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 560px) {
          .pf-info-grid { grid-template-columns: 1fr; }
        }

        .pf-info-item {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 14px 16px;
        }

        .pf-info-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
        }

        .pf-info-value {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }

        .pf-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .pf-field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pf-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .pf-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 14px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }

        .pf-input:focus {
          border-color: #00d4ff;
          background: rgba(0,212,255,0.04);
        }

        .pf-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .pf-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.05em;
        }

        .pf-input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 560px) {
          .pf-input-grid { grid-template-columns: 1fr; }
        }

        .pf-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 4px 0;
        }

        .pf-actions {
          display: flex;
          justify-content: flex-end;
        }

        .pf-save-btn {
          background: #00d4ff;
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 12px 28px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }

        .pf-save-btn:hover:not(:disabled) {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .pf-save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pf-loading {
          text-align: center;
          padding: 80px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
          animation: blink 1.4s infinite;
        }

        .pf-error {
          text-align: center;
          padding: 80px 0;
          font-size: 13px;
          color: #ff4757;
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="pf-root">
        <Navbar />
        <div className="pf-content">
          <div className="pf-page-label">Account</div>
          <div className="pf-page-title">My Profile</div>

          {loading && <div className="pf-loading">Loading profile...</div>}
          {error && <div className="pf-error">{error}</div>}

          {!loading && !error && profile && (
            <>
              {/* Info Card */}
              <div className="pf-card">
                <div className="pf-card-title">Profile Overview</div>
                <div className="pf-profile-header">
                  <div
                    className="pf-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${roleColors[profile.role] || "#00d4ff"}33, ${roleColors[profile.role] || "#00d4ff"}11)`,
                      border: `2px solid ${roleColors[profile.role] || "#00d4ff"}55`,
                    }}
                  >
                    {getInitials(profile.name)}
                  </div>
                  <div>
                    <div className="pf-name">{profile.name}</div>
                    <div className="pf-email">{profile.email}</div>
                    <span
                      className="pf-badge"
                      style={{
                        background: `${roleColors[profile.role] || "#00d4ff"}26`,
                        border: `1px solid ${roleColors[profile.role] || "#00d4ff"}4d`,
                        color: roleColors[profile.role] || "#00d4ff",
                      }}
                    >
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="pf-info-grid">
                  <div className="pf-info-item">
                    <div className="pf-info-label">Account Status</div>
                    <div
                      className="pf-info-value"
                      style={{
                        color:
                          profile.status === "active" ? "#2ed573" : "#ff4757",
                      }}
                    >
                      {profile.status || "active"}
                    </div>
                  </div>
                  <div className="pf-info-item">
                    <div className="pf-info-label">Role</div>
                    <div
                      className="pf-info-value"
                      style={{ color: roleColors[profile.role] || "#00d4ff" }}
                    >
                      {profile.role}
                    </div>
                  </div>
                  <div className="pf-info-item">
                    <div className="pf-info-label">Member Since</div>
                    <div className="pf-info-value">
                      {formatDate(profile.createdAt)}
                    </div>
                  </div>
                  <div className="pf-info-item">
                    <div className="pf-info-label">Last Updated</div>
                    <div className="pf-info-value">
                      {formatDate(profile.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Card */}
              <div className="pf-card">
                <div className="pf-card-title">Edit Profile</div>
                <form className="pf-form" onSubmit={handleSave}>
                  <div className="pf-field-group">
                    <label className="pf-label">Full Name</label>
                    <input
                      className="pf-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="pf-field-group">
                    <label className="pf-label">Email Address</label>
                    <input
                      className="pf-input"
                      type="email"
                      value={profile.email}
                      readOnly
                      style={{ opacity: 0.45, cursor: "not-allowed" }}
                    />
                    <span className="pf-hint">Email cannot be changed.</span>
                  </div>

                  <hr className="pf-divider" />

                  <div className="pf-field-group">
                    <label className="pf-label">New Password</label>
                    <div className="pf-input-grid">
                      <input
                        className="pf-input"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        autoComplete="new-password"
                      />
                      <input
                        className="pf-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                    </div>
                    <span className="pf-hint">
                      Leave blank to keep current password.
                    </span>
                  </div>

                  <div className="pf-actions">
                    <button
                      className="pf-save-btn"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
