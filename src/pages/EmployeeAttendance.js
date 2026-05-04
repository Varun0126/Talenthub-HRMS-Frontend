import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeeAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchAttendance = () => {
    employeeAPI
      .getAttendance()
      .then((res) => setAttendance(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleClockIn = async () => {
    setActionLoading(true);
    setMsg("");
    try {
      await employeeAPI.clockIn();
      setMsg("Clocked in successfully!");
      fetchAttendance();
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
        "Operation failed"
      );
    } finally {
      setActionLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    setMsg("");
    try {
      await employeeAPI.clockOut();
      setMsg("Clocked out successfully!");
      fetchAttendance();
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
        "Operation failed"
      );
    } finally {
      setActionLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const formatTime = (dt) => {
    if (!dt) return "—";
    return new Date(dt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check today's record
  const today = new Date().toISOString().split("T")[0];
  const todayRecord = attendance.find((a) => a.date === today);

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
        <h1 className="page-title">Attendance</h1>
      </div>

      {/* Clock In/Out Actions */}
      <div className="section-card mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Today's Attendance</h2>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClockIn}
              disabled={actionLoading || (todayRecord && todayRecord.clockIn)}
              className="btn-success px-6 py-3 text-sm font-semibold disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Clock In
              </span>
            </button>
            <button
              onClick={handleClockOut}
              disabled={actionLoading || !todayRecord || todayRecord?.clockOut}
              className="btn-danger px-6 py-3 text-sm font-semibold disabled:opacity-40"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Clock Out
              </span>
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`mt-4 p-3 rounded-xl text-sm ${String(msg).includes("success")
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
          >
            {msg}
          </div>
        )}

        {todayRecord && (
          <div className="mt-4 flex gap-4">
            <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20 flex-1">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Clock In</p>
              <p className="text-lg font-bold text-white">{formatTime(todayRecord.clockIn)}</p>
            </div>
            <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/20 flex-1">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Clock Out</p>
              <p className="text-lg font-bold text-white">{formatTime(todayRecord.clockOut)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="section-card">
        <h2 className="text-lg font-semibold text-white mb-4">Attendance History</h2>
        {attendance.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No attendance records</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...attendance].reverse().map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium text-white">{a.date}</td>
                    <td>{formatTime(a.clockIn)}</td>
                    <td>{formatTime(a.clockOut)}</td>
                    <td>
                      {a.clockOut ? (
                        <span className="badge-success">Complete</span>
                      ) : a.clockIn ? (
                        <span className="badge-warning">In Progress</span>
                      ) : (
                        <span className="badge-danger">Absent</span>
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

export default EmployeeAttendance;
