import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { adminAPI } from "../api/api";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = () => {
    Promise.all([adminAPI.getCompanies(), adminAPI.getAllUsers()])
      .then(([compRes, userRes]) => {
        setCompanies(compRes.data);
        setUsers(userRes.data.filter((u) => u.role === "COMPANY"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCompany(name, email);
      setName("");
      setEmail("");
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to create company");
    }
  };

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.toggleCompany(id);
      fetchData();
    } catch (err) {
      alert("Failed to toggle company");
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (userId) => {
    setActionLoading(`user-${userId}`);
    try {
      await adminAPI.activateCompany(userId);
      fetchData();
    } catch (err) {
      alert("Failed to activate company");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Company Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Create Company
        </button>
      </div>

      {/* Companies Table */}
      <div className="section-card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Registered Companies</h2>
        {companies.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No companies registered yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-slate-500">#{c.id}</td>
                    <td className="font-medium text-white">{c.name}</td>
                    <td>
                      <span className={c.active ? "badge-success" : "badge-danger"}>
                        {c.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(c.id)}
                        disabled={actionLoading === c.id}
                        className={c.active ? "btn-danger text-xs" : "btn-success text-xs"}
                      >
                        {actionLoading === c.id ? "..." : c.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Company Users (from registration) */}
      <div className="section-card">
        <h2 className="text-lg font-semibold text-white mb-4">Company User Accounts</h2>
        {users.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No company users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-mono text-slate-500">#{u.id}</td>
                    <td className="font-medium text-white">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.active ? "badge-success" : "badge-warning"}>
                        {u.active ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td>
                      {!u.active && (
                        <button
                          onClick={() => handleActivate(u.id)}
                          disabled={actionLoading === `user-${u.id}`}
                          className="btn-success text-xs"
                        >
                          {actionLoading === `user-${u.id}` ? "..." : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Create New Company</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="company-name">
                  Company Name
                </label>
                <input
                  id="company-name"
                  className="form-input"
                  placeholder="Enter company name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="company-email">
                  Admin Email
                </label>
                <input
                  id="company-email"
                  type="email"
                  className="form-input"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminCompanies;
