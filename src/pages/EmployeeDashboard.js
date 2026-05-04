import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    employeeAPI
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="page-title">Employee Dashboard</h1>
      </div>

      {/* Welcome card */}
      <div className="glass-card p-6 mb-6 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || "E"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Welcome, {user?.name || "Employee"}!
            </h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="stat-card group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.department || "—"}</p>
          <p className="text-sm text-slate-400">Department</p>
        </div>

        <div className="stat-card group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.designation || "—"}</p>
          <p className="text-sm text-slate-400">Designation</p>
        </div>

        <div className="stat-card group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalLeaves ?? 0}</p>
          <p className="text-sm text-slate-400">Total Leaves</p>
        </div>

        <div className="stat-card group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white mb-4 transition-transform duration-300 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-white">{stats?.totalPayslips ?? 0}</p>
          <p className="text-sm text-slate-400">Total Payslips</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboard;