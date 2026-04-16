import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#e2e8f0",
              border: "1px solid #00d4ff33",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#00d4ff", secondary: "#0a0a0f" },
            },
            error: {
              iconTheme: { primary: "#ff4757", secondary: "#0a0a0f" },
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Admin + Manager */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <Navbar />
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <Navbar />
                <UserDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* All logged in users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
