import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { companyAPI } from "../api/api";

function CompanyDesignations() {
  const [designations, setDesignations] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDesignations = () => {
    companyAPI
      .getDesignations()
      .then((res) => setDesignations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.createDesignation(title);
      setTitle("");
      fetchDesignations();
    } catch (err) {
      alert(err.response?.data || "Failed to create designation");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this designation?")) return;
    try {
      await companyAPI.deleteDesignation(id);
      fetchDesignations();
    } catch (err) {
      alert("Failed to delete designation");
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
        <h1 className="page-title">Designations</h1>
      </div>

      {/* Create Form */}
      <div className="section-card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Designation</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            className="form-input flex-1 max-w-md"
            placeholder="Designation title (e.g., Software Engineer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </form>
      </div>

      {/* Designation List */}
      <div className="section-card">
        <h2 className="text-lg font-semibold text-white mb-4">
          All Designations ({designations.length})
        </h2>
        {designations.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            No designations created yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {designations.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-slate-800/30 border border-slate-700/30 rounded-xl px-5 py-4 group hover:bg-slate-800/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">{d.title}</p>
                    <p className="text-xs text-slate-500">ID: #{d.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(d.id)}
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

export default CompanyDesignations;
