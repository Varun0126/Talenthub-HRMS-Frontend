import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { adminAPI } from "../api/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    adminAPI
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role) => {
    const styles = {
      ADMIN: "badge-info",
      COMPANY: "badge-success",
      HR: "badge-warning",
      EMPLOYEE: "badge bg-purple-500/15 text-purple-400 border border-purple-500/20",
    };
    return styles[role] || "badge-info";
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
        <h1 className="page-title">All Users</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{filteredUsers.length} users</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="form-input max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-input max-w-[160px]"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="COMPANY">Company</option>
          <option value="HR">HR</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
      </div>

      <div className="section-card">
        {filteredUsers.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Company ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="font-mono text-slate-500">#{u.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={roleBadge(u.role)}>{u.role}</span>
                    </td>
                    <td>
                      <span className={u.active ? "badge-success" : "badge-danger"}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="font-mono text-slate-500">
                      {u.companyId ? `#${u.companyId}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;
