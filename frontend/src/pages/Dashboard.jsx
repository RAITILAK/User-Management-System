import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    admins: 0,
    managers: 0,
    regularUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/users?limit=100");
      const users = res.data.users;

      setStats({
        totalUsers: res.data.totalUsers,
        activeUsers: users.filter((u) => u.status === "active").length,
        inactiveUsers: users.filter((u) => u.status === "inactive").length,
        admins: users.filter((u) => u.role === "admin").length,
        managers: users.filter((u) => u.role === "manager").length,
        regularUsers: users.filter((u) => u.role === "user").length,
      });

      setRecentUsers(users.slice(0, 5));
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      color: "#00d4ff",
      bg: "rgba(0,212,255,0.08)",
      border: "rgba(0,212,255,0.2)",
    },
    {
      label: "Active",
      value: stats.activeUsers,
      color: "#2ed573",
      bg: "rgba(46,213,115,0.08)",
      border: "rgba(46,213,115,0.2)",
    },
    {
      label: "Inactive",
      value: stats.inactiveUsers,
      color: "#ff4757",
      bg: "rgba(255,71,87,0.08)",
      border: "rgba(255,71,87,0.2)",
    },
    {
      label: "Admins",
      value: stats.admins,
      color: "#ff4757",
      bg: "rgba(255,71,87,0.08)",
      border: "rgba(255,71,87,0.2)",
    },
    {
      label: "Managers",
      value: stats.managers,
      color: "#ffa502",
      bg: "rgba(255,165,2,0.08)",
      border: "rgba(255,165,2,0.2)",
    },
    {
      label: "Users",
      value: stats.regularUsers,
      color: "#00d4ff",
      bg: "rgba(0,212,255,0.08)",
      border: "rgba(0,212,255,0.2)",
    },
  ];

  const roleColors = { admin: "#ff4757", manager: "#ffa502", user: "#00d4ff" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Mono', monospace;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .dash-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .dash-content {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dash-header {
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dash-greeting {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .dash-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .dash-title span { color: #00d4ff; }

        .dash-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 40px;
          animation: fadeUp 0.5s ease 0.1s forwards;
          opacity: 0;
        }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          padding: 20px 16px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s ease;
          cursor: default;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--card-border);
          background: var(--card-bg);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          animation: fadeUp 0.5s ease 0.2s forwards;
          opacity: 0;
        }

        .panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .panel-badge {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.08em;
        }

        .recent-user-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 4px;
        }

        .recent-user-row:last-child { border-bottom: none; }

        .recent-user-row:hover { padding-left: 8px; }

        .recent-user-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .recent-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
        }

        .recent-name {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }

        .recent-email {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 1px;
        }

        .role-badge {
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 100px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }

        .action-btn:hover {
          background: rgba(0,212,255,0.06);
          border-color: rgba(0,212,255,0.2);
          color: #ffffff;
          transform: translateX(4px);
        }

        .action-arrow {
          color: rgba(255,255,255,0.2);
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .action-btn:hover .action-arrow {
          color: #00d4ff;
          transform: translateX(4px);
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          letter-spacing: 0.1em;
        }

        .loading-dot {
          display: inline-block;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-grid-bg" />
        <div className="dash-content">
          {loading ? (
            <div className="loading-state">
              Loading<span className="loading-dot">...</span>
            </div>
          ) : (
            <>
              <div className="dash-header">
                <p className="dash-greeting">Welcome back</p>
                <h1 className="dash-title">
                  Hello, <span>{user?.name}</span>
                </h1>
                <p className="dash-subtitle">
                  Here's what's happening in your system today
                </p>
              </div>

              <div className="stats-grid">
                {statCards.map((card, i) => (
                  <div
                    key={i}
                    className="stat-card"
                    style={{
                      "--card-border": card.border,
                      "--card-bg": card.bg,
                    }}
                  >
                    <div className="stat-value" style={{ color: card.color }}>
                      {card.value}
                    </div>
                    <div className="stat-label">{card.label}</div>
                  </div>
                ))}
              </div>

              <div className="bottom-grid">
                {/* Recent Users */}
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Recent Users</h2>
                    <span className="panel-badge">LATEST 5</span>
                  </div>
                  {recentUsers.map((u) => (
                    <div
                      key={u._id}
                      className="recent-user-row"
                      onClick={() => navigate(`/users/${u._id}`)}
                    >
                      <div className="recent-user-left">
                        <div
                          className="recent-avatar"
                          style={{
                            background: `${roleColors[u.role]}15`,
                            color: roleColors[u.role],
                            border: `1px solid ${roleColors[u.role]}30`,
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="recent-name">{u.name}</div>
                          <div className="recent-email">{u.email}</div>
                        </div>
                      </div>
                      <span
                        className="role-badge"
                        style={{
                          background: `${roleColors[u.role]}15`,
                          color: roleColors[u.role],
                          border: `1px solid ${roleColors[u.role]}30`,
                        }}
                      >
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Quick Actions</h2>
                    <span className="panel-badge">ADMIN</span>
                  </div>
                  <div className="quick-actions">
                    {[
                      { label: "View All Users", path: "/users" },
                      {
                        label: "Create New User",
                        path: "/users?action=create",
                      },
                      { label: "My Profile", path: "/profile" },
                    ].map((action) => (
                      <button
                        key={action.path}
                        className="action-btn"
                        onClick={() => navigate(action.path)}
                      >
                        {action.label}
                        <span className="action-arrow">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
