import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const roleColors = {
  admin: "#ff4757",
  manager: "#ffa502",
  user: "#00d4ff",
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.data || res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

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

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ud-root {
          min-height: 100vh;
          background-color: #0a0a0f;
          background-image:
            linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          font-family: 'DM Mono', monospace;
          color: #e0e0e0;
        }

        .ud-content {
          max-width: 900px;
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

        .ud-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 32px;
        }
        .ud-back-btn:hover {
          border-color: #00d4ff;
          color: #00d4ff;
        }

        .ud-page-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
        }

        .ud-page-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 32px;
        }

        .ud-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
        }

        .ud-card-title {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .ud-profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }

        .ud-avatar {
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

        .ud-name {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
        }

        .ud-email {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 10px;
        }

        .ud-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .ud-badge {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 500;
        }

        .ud-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .ud-fields { grid-template-columns: 1fr; }
        }

        .ud-field {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 14px 16px;
        }

        .ud-field-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
        }

        .ud-field-value {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }

        .ud-audit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 600px) {
          .ud-audit-grid { grid-template-columns: 1fr; }
        }

        .ud-audit-box {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 16px;
        }

        .ud-audit-box-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 12px;
        }

        .ud-audit-name {
          font-size: 13px;
          color: #fff;
          margin-bottom: 4px;
        }

        .ud-audit-email {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        .ud-loading {
          text-align: center;
          padding: 80px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
          animation: blink 1.4s infinite;
        }

        .ud-error {
          text-align: center;
          padding: 80px 0;
          font-size: 13px;
          color: #ff4757;
          letter-spacing: 0.08em;
        }
      `}</style>

      <div className="ud-root">
        <Navbar />
        <div className="ud-content">
          <button className="ud-back-btn" onClick={() => navigate("/users")}>
            ← Back to Users
          </button>

          <div className="ud-page-label">User Management</div>
          <div className="ud-page-title">User Detail</div>

          {loading && <div className="ud-loading">Loading user...</div>}
          {error && <div className="ud-error">{error}</div>}

          {!loading && !error && user && (
            <>
              {/* Profile Card */}
              <div className="ud-card">
                <div className="ud-card-title">Profile Overview</div>
                <div className="ud-profile-header">
                  <div
                    className="ud-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${roleColors[user.role] || "#00d4ff"}33, ${roleColors[user.role] || "#00d4ff"}11)`,
                      border: `2px solid ${roleColors[user.role] || "#00d4ff"}55`,
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="ud-name">{user.name}</div>
                    <div className="ud-email">{user.email}</div>
                    <div className="ud-badges">
                      <span
                        className="ud-badge"
                        style={{
                          background: `${roleColors[user.role] || "#00d4ff"}26`,
                          border: `1px solid ${roleColors[user.role] || "#00d4ff"}4d`,
                          color: roleColors[user.role] || "#00d4ff",
                        }}
                      >
                        {user.role}
                      </span>
                      <span
                        className="ud-badge"
                        style={{
                          background:
                            user.status === "active"
                              ? "#2ed57326"
                              : "#ff475726",
                          border: `1px solid ${user.status === "active" ? "#2ed57380" : "#ff475780"}`,
                          color:
                            user.status === "active" ? "#2ed573" : "#ff4757",
                        }}
                      >
                        {user.status || "active"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ud-fields">
                  <div className="ud-field">
                    <div className="ud-field-label">User ID</div>
                    <div
                      className="ud-field-value"
                      style={{ fontSize: "11px", opacity: 0.6 }}
                    >
                      {user._id}
                    </div>
                  </div>
                  <div className="ud-field">
                    <div className="ud-field-label">Email Address</div>
                    <div className="ud-field-value">{user.email}</div>
                  </div>
                  <div className="ud-field">
                    <div className="ud-field-label">Created At</div>
                    <div className="ud-field-value">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                  <div className="ud-field">
                    <div className="ud-field-label">Last Updated</div>
                    <div className="ud-field-value">
                      {formatDate(user.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Card */}
              <div className="ud-card">
                <div className="ud-card-title">Audit Information</div>
                <div className="ud-audit-grid">
                  <div className="ud-audit-box">
                    <div className="ud-audit-box-label">Created By</div>
                    {user.createdBy ? (
                      <>
                        <div className="ud-audit-name">
                          {user.createdBy.name || "—"}
                        </div>
                        <div className="ud-audit-email">
                          {user.createdBy.email || "—"}
                        </div>
                      </>
                    ) : (
                      <div className="ud-audit-email">Not available</div>
                    )}
                  </div>
                  <div className="ud-audit-box">
                    <div className="ud-audit-box-label">Last Updated By</div>
                    {user.updatedBy ? (
                      <>
                        <div className="ud-audit-name">
                          {user.updatedBy.name || "—"}
                        </div>
                        <div className="ud-audit-email">
                          {user.updatedBy.email || "—"}
                        </div>
                      </>
                    ) : (
                      <div className="ud-audit-email">Not available</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
