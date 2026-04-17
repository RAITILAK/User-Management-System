import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const roleColors = {
    admin: "#ff4757",
    manager: "#ffa502",
    user: "#00d4ff",
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard", roles: ["admin"] },
    { label: "Users", path: "/users", roles: ["admin", "manager"] },
    { label: "Profile", path: "/profile", roles: ["admin", "manager", "user"] },
  ];

  const visibleLinks = navLinks.filter((link) =>
    link.roles.includes(user?.role),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 15, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-family: 'DM Mono', monospace;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #ffffff;
          letter-spacing: -0.02em;
          cursor: pointer;
        }

        .navbar-logo span { color: #00d4ff; }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          background: none;
          font-family: 'DM Mono', monospace;
        }

        .nav-link:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.04);
        }

        .nav-link.active {
          color: #00d4ff;
          background: rgba(0,212,255,0.08);
          border-color: rgba(0,212,255,0.2);
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12px;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .user-role {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .logout-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.08);
          background: none;
          font-family: 'DM Mono', monospace;
        }

        .logout-btn:hover {
          color: #ff4757;
          border-color: rgba(255,71,87,0.3);
          background: rgba(255,71,87,0.06);
        }

        .divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
            User<span>Control</span>
          </div>

          {/* Nav Links */}
          <div className="navbar-links">
            {visibleLinks.map((link) => (
              <button
                key={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side — user info + logout */}
          <div className="navbar-right">
            <div className="user-info">
              <div
                className="user-avatar"
                style={{
                  background: `${roleColors[user?.role]}15`,
                  color: roleColors[user?.role],
                  border: `1px solid ${roleColors[user?.role]}30`,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-meta">
                <span className="user-name">{user?.name}</span>
                <span
                  className="user-role"
                  style={{ color: roleColors[user?.role] }}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="divider" />

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
