import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchMode = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", { email, password });
        login(
          {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            status: res.data.status,
          },
          res.data.accessToken,
        );
        toast.success(`Welcome back, ${res.data.name}`);
        if (res.data.role === "admin") navigate("/dashboard");
        else if (res.data.role === "manager") navigate("/users");
        else navigate("/profile");
      } else {
        await api.post("/auth/register", { name, email, password });
        toast.success("Account created! Please sign in.");
        switchMode("login");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (mode === "login" ? "Login failed" : "Registration failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
 
        * { margin: 0; padding: 0; box-sizing: border-box; }
 
        .login-root {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          position: relative;
          overflow: hidden;
        }
 
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
 
        .glow-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
 
        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 212, 255, 0.15);
          border-radius: 16px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 80px rgba(0, 212, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.05);
          animation: fadeUp 0.6s ease forwards;
        }
 
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
 
        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: #00d4ff;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
 
        .badge-dot {
          width: 6px;
          height: 6px;
          background: #00d4ff;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
 
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
 
        .login-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
 
        .login-title span {
          color: #00d4ff;
        }
 
        .login-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 32px;
          letter-spacing: 0.02em;
        }
 
        .mode-toggle {
          display: flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
          gap: 4px;
        }
 
        .mode-btn {
          flex: 1;
          padding: 9px;
          border: none;
          border-radius: 7px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          color: rgba(255,255,255,0.35);
        }
 
        .mode-btn.active {
          background: rgba(0,212,255,0.12);
          color: #00d4ff;
          border: 1px solid rgba(0,212,255,0.25);
        }
 
        .mode-btn:hover:not(.active) {
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.04);
        }
 
        .field {
          margin-bottom: 20px;
        }
 
        .field label {
          display: block;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
 
        .field input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'DM Mono', monospace;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }
 
        .field input:focus {
          border-color: rgba(0, 212, 255, 0.5);
          background: rgba(0, 212, 255, 0.03);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.08);
        }
 
        .field input::placeholder {
          color: rgba(255,255,255,0.15);
        }
 
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #00d4ff;
          color: #0a0a0f;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }
 
        .login-btn:hover:not(:disabled) {
          background: #33ddff;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
          transform: translateY(-1px);
        }
 
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
 
        .login-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
 
        .login-footer-text {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
 
        .corner-decoration {
          position: absolute;
          top: -1px;
          right: 32px;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00d4ff, transparent);
          border-radius: 0 0 4px 4px;
        }
      `}</style>

      <div className="login-root">
        <div className="grid-bg" />
        <div className="glow-orb" />

        <div className="login-card">
          <div className="corner-decoration" />

          <div className="login-badge">
            <div className="badge-dot" />
            Secure Access
          </div>

          <h1 className="login-title">
            User
            <br />
            <span>Control</span> Panel
          </h1>
          <p className="login-subtitle">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Create a new account to get started"}
          </p>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Authenticating..."
                  : "Creating Account..."
                : mode === "login"
                  ? "Sign In →"
                  : "Create Account →"}
            </button>
          </form>

          <div className="login-footer">
            <span className="login-footer-text">RBAC ENABLED</span>
            <span className="login-footer-text">JWT + REFRESH TOKEN</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
