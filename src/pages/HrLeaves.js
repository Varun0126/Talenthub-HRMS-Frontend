import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { hrAPI } from "../api/api";

function HrLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchLeaves = () => {
    hrAPI
      .getAllLeaves()
      .then((res) => setLeaves(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await hrAPI.approveLeave(id);
      fetchLeaves();
    } catch (err) {
      alert("Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await hrAPI.rejectLeave(id);
      fetchLeaves();
    } catch (err) {
      alert("Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLeaves =
    filter === "ALL"
      ? leaves
      : leaves.filter((l) => l.status === filter);

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
        <h1 className="page-title">Leave Requests</h1>
        <div className="flex items-center gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        {filteredLeaves.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            No leave requests found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Reason</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((l) => (
                  <tr key={l.id}>
                    <td className="font-mono text-slate-500">#{l.id}</td>
                    <td className="font-mono">#{l.employeeId}</td>
                    <td className="max-w-[200px] truncate">{l.reason}</td>
                    <td>{l.fromDate}</td>
                    <td>{l.toDate}</td>
                    <td>
                      <span className={statusBadge(l.status)}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(l.id)}
                            disabled={actionLoading === l.id}
                            className="btn-success text-xs"
                          >
                            {actionLoading === l.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(l.id)}
                            disabled={actionLoading === l.id}
                            className="btn-danger text-xs"
                          >
                            {actionLoading === l.id ? "..." : "Reject"}
                          </button>
                        </div>
                      )}
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

export default HrLeaves;
