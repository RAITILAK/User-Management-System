import { useNavigate } from "react-router-dom";

const roleColors = {
  admin: "#ff4757",
  manager: "#ffa502",
  user: "#00d4ff",
};

const UserTable = ({ users, onDeactivate, onEdit, currentUserRole }) => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .table-wrap {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
        }

        thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        thead th {
          padding: 14px 20px;
          text-align: left;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 400;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.15s ease;
          cursor: pointer;
        }

        tbody tr:last-child { border-bottom: none; }

        tbody tr:hover { background: rgba(255,255,255,0.02); }

        td {
          padding: 14px 20px;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
        }

        .td-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .td-avatar {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
        }

        .td-name-text {
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        .role-badge {
          display: inline-block;
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 100px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status-dot {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-action {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          background: none;
        }

        .btn-view {
          color: #00d4ff;
          border-color: rgba(0,212,255,0.2);
        }

        .btn-view:hover {
          background: rgba(0,212,255,0.08);
        }

        .btn-edit {
          color: #ffa502;
          border-color: rgba(255,165,2,0.2);
        }

        .btn-edit:hover {
          background: rgba(255,165,2,0.08);
        }

        .btn-deactivate {
          color: #ff4757;
          border-color: rgba(255,71,87,0.2);
        }

        .btn-deactivate:hover {
          background: rgba(255,71,87,0.08);
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">No users found</div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} onClick={() => navigate(`/users/${u._id}`)}>
                  {/* Name + Avatar */}
                  <td>
                    <div className="td-name">
                      <div
                        className="td-avatar"
                        style={{
                          background: `${roleColors[u.role]}15`,
                          color: roleColors[u.role],
                          border: `1px solid ${roleColors[u.role]}30`,
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="td-name-text">{u.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td>{u.email}</td>

                  {/* Role */}
                  <td>
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
                  </td>

                  {/* Status */}
                  <td>
                    <span className="status-dot">
                      <span
                        className="dot"
                        style={{
                          background:
                            u.status === "active" ? "#2ed573" : "#ff4757",
                        }}
                      />
                      {u.status}
                    </span>
                  </td>

                  {/* Created At */}
                  <td>
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td>
                    <div
                      className="actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn-action btn-view"
                        onClick={() => navigate(`/users/${u._id}`)}
                      >
                        View
                      </button>

                      {currentUserRole === "admin" && (
                        <>
                          <button
                            className="btn-action btn-edit"
                            onClick={() => onEdit(u)}
                          >
                            Edit
                          </button>

                          {u.status === "active" && (
                            <button
                              className="btn-action btn-deactivate"
                              onClick={() => onDeactivate(u._id)}
                            >
                              Deactivate
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
