import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { companyAPI } from "../api/api";

function CompanyDepartments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDepartments = () => {
    companyAPI
      .getDepartments()
      .then((res) => setDepartments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.createDepartment(name);
      setName("");
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data || "Failed to create department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await companyAPI.deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      alert("Failed to delete department");
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
        <h1 className="page-title">Departments</h1>
      </div>

      {/* Create Form */}
      <div className="section-card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Department</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            className="form-input flex-1 max-w-md"
            placeholder="Department name (e.g., Engineering)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
      </div>

      {/* Department List */}
      <div className="section-card">
        <h2 className="text-lg font-semibold text-white mb-4">
          All Departments ({departments.length})
        </h2>
        {departments.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No departments created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl px-5 py-4 group hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">{dept.name}</p>
                    <p className="text-xs text-slate-500">ID: #{dept.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 p-2"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CompanyDepartments;
