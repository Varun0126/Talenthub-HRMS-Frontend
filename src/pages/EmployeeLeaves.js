import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeeLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });

  const fetchLeaves = () => {
    employeeAPI
      .getLeaves()
      .then((res) => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await employeeAPI.applyLeave(form);
      setForm({ reason: "", fromDate: "", toDate: "" });
      setShowModal(false);
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data || "Failed to apply for leave");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "APPROVED") return "badge-success";
    if (status === "REJECTED") return "badge-danger";
    return "badge-warning";
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
        <h1 className="page-title">My Leaves</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Apply Leave
        </button>
      </div>

      <div className="section-card">
        {leaves.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="text-slate-500">No leave requests yet</p>
            <p className="text-slate-600 text-sm mt-1">Apply for your first leave</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l.id}>
                    <td className="font-mono text-slate-500">#{l.id}</td>
                    <td className="max-w-[250px]">
                      <p className="text-white truncate">{l.reason}</p>
                    </td>
                    <td>{l.fromDate}</td>
                    <td>{l.toDate}</td>
                    <td>
                      <span className={statusBadge(l.status)}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Apply for Leave</h3>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="leave-reason">
                  Reason
                </label>
                <textarea
                  id="leave-reason"
                  className="form-input min-h-[80px] resize-none"
                  placeholder="Enter reason for leave"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="leave-from">
                    From Date
                  </label>
                  <input
                    id="leave-from"
                    type="date"
                    className="form-input"
                    value={form.fromDate}
                    onChange={(e) =>
                      setForm({ ...form, fromDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="leave-to">
                    To Date
                  </label>
                  <input
                    id="leave-to"
                    type="date"
                    className="form-input"
                    value={form.toDate}
                    onChange={(e) =>
                      setForm({ ...form, toDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? "Submitting..." : "Apply"}
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

export default EmployeeLeaves;
