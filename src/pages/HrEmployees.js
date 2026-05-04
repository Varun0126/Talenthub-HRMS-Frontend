import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { hrAPI, userAPI, companyAPI } from "../api/api";

function HrEmployees() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    departmentId: "",
    designationId: "",
  });

  const fetchData = () => {
    Promise.all([
      userAPI.getByRoleAndCompany("EMPLOYEE"),
      companyAPI.getDepartments(),
      companyAPI.getDesignations(),
    ])
      .then(([userRes, deptRes, desRes]) => {
        setUsers(userRes.data);
        setDepartments(deptRes.data);
        setDesignations(desRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await hrAPI.createEmployee({
        name: form.name,
        email: form.email,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        designationId: form.designationId ? Number(form.designationId) : null,
      });
      setForm({ name: "", email: "", departmentId: "", designationId: "" });
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to create employee");
    } finally {
      setSubmitting(false);
    }
  };

  const getDeptName = (id) => departments.find((d) => d.id === id)?.name || "—";
  const getDesName = (id) => designations.find((d) => d.id === id)?.title || "—";

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
        <h1 className="page-title">Employee Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Employee
        </button>
      </div>

      <div className="section-card">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-slate-500">No employees added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{getDeptName(u.departmentId)}</td>
                    <td>{getDesName(u.designationId)}</td>
                    <td>
                      <span className={u.active ? "badge-success" : "badge-danger"}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-1">Add Employee</h3>
            <p className="text-sm text-slate-400 mb-4">Default password: welcome123</p>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="emp-name">
                  Full Name
                </label>
                <input
                  id="emp-name"
                  className="form-input"
                  placeholder="Enter employee name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="emp-email">
                  Email Address
                </label>
                <input
                  id="emp-email"
                  type="email"
                  className="form-input"
                  placeholder="employee@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="emp-dept">
                  Department
                </label>
                <select
                  id="emp-dept"
                  className="form-input"
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="emp-des">
                  Designation
                </label>
                <select
                  id="emp-des"
                  className="form-input"
                  value={form.designationId}
                  onChange={(e) =>
                    setForm({ ...form, designationId: e.target.value })
                  }
                >
                  <option value="">Select Designation</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? "Creating..." : "Add Employee"}
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

export default HrEmployees;
