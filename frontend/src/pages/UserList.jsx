import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import UserTable from "../components/UserTable";

// Edit Modal Component
const EditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${user._id}`, form);
      toast.success("User updated");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          background: #0f0f18;
          border: 1px solid rgba(0,212,255,0.2);
          border-radius: 16px;
          padding: 36px;
          width: 100%;
          max-width: 460px;
          font-family: 'DM Mono', monospace;
          animation: fadeUp 0.2s ease forwards;
        }

        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 28px;
        }

        .modal-title span { color: #00d4ff; }

        .modal-field {
          margin-bottom: 18px;
        }

        .modal-field label {
          display: block;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .modal-field input,
        .modal-field select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .modal-field input:focus,
        .modal-field select:focus {
          border-color: rgba(0,212,255,0.4);
          box-shadow: 0 0 0 3px rgba(0,212,255,0.06);
        }

        .modal-field select option {
          background: #0f0f18;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .btn-save {
          flex: 1;
          padding: 11px;
          background: #00d4ff;
          color: #0a0a0f;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-save:hover:not(:disabled) {
          background: #33ddff;
          box-shadow: 0 0 20px rgba(0,212,255,0.3);
        }

        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-cancel {
          flex: 1;
          padding: 11px;
          background: none;
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">
            Edit <span>{user.name}</span>
          </h2>

          <div className="modal-field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="modal-field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="modal-field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Create Modal Component
const CreateModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/users", form);
      toast.success("User created");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          Create <span>New User</span>
        </h2>

        <div className="modal-field">
          <label>Name</label>
          <input
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="modal-field">
          <label>Email</label>
          <input
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="modal-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="modal-field">
          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="modal-field">
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main UserList Page
const UserList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters + pagination state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals
  const [editingUser, setEditingUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  // Open create modal if ?action=create in URL (from dashboard quick action)
  useEffect(() => {
    if (searchParams.get("action") === "create") setShowCreate(true);
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, statusFilter, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deactivated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to deactivate");
    }
  };

  // Reset to page 1 when filters change
  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleRoleFilter = (val) => {
    setRoleFilter(val);
    setPage(1);
  };

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .ul-root {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'DM Mono', monospace;
          padding: 40px;
        }

        .ul-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .ul-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          animation: fadeUp 0.4s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ul-title {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .ul-title span { color: #00d4ff; }

        .ul-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
        }

        .btn-create {
          padding: 10px 20px;
          background: #00d4ff;
          color: #0a0a0f;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.03em;
        }

        .btn-create:hover {
          background: #33ddff;
          box-shadow: 0 0 24px rgba(0,212,255,0.3);
          transform: translateY(-1px);
        }

        .filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          animation: fadeUp 0.4s ease 0.1s forwards;
          opacity: 0;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: rgba(0,212,255,0.4);
          background: rgba(0,212,255,0.02);
        }

        .search-input::placeholder { color: rgba(255,255,255,0.2); }

        .filter-select {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: rgba(255,255,255,0.6);
          outline: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-select:focus {
          border-color: rgba(0,212,255,0.4);
        }

        .filter-select option { background: #0f0f18; }

        .table-section {
          animation: fadeUp 0.4s ease 0.2s forwards;
          opacity: 0;
        }

        .table-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .table-count {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
        }

        .table-count span { color: #00d4ff; }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px;
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          letter-spacing: 0.1em;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }

        .page-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: none;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-btn:hover:not(:disabled) {
          border-color: rgba(0,212,255,0.3);
          color: #00d4ff;
          background: rgba(0,212,255,0.06);
        }

        .page-btn.active {
          background: rgba(0,212,255,0.12);
          border-color: rgba(0,212,255,0.4);
          color: #00d4ff;
        }

        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          padding: 0 8px;
        }
      `}</style>

      {/* Modals */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={fetchUsers}
        />
      )}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onSave={fetchUsers} />
      )}

      <div className="ul-root">
        <div className="ul-content">
          {/* Header */}
          <div className="ul-header">
            <div>
              <h1 className="ul-title">
                All <span>Users</span>
              </h1>
              <p className="ul-subtitle">
                {totalUsers} total users in the system
              </p>
            </div>
            {user?.role === "admin" && (
              <button
                className="btn-create"
                onClick={() => setShowCreate(true)}
              >
                + Create User
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <input
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div className="table-section">
            <div className="table-meta">
              <span className="table-count">
                Showing <span>{users.length}</span> of <span>{totalUsers}</span>{" "}
                users — Page <span>{page}</span> of <span>{totalPages}</span>
              </span>
            </div>

            {loading ? (
              <div className="loading-state">Loading...</div>
            ) : (
              <UserTable
                users={users}
                onDeactivate={handleDeactivate}
                onEdit={(u) => setEditingUser(u)}
                currentUserRole={user?.role}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                >
                  ←
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}

                <button
                  className="page-btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;
