import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { hrAPI } from "../api/api";

function HrPayroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setPayslip(null);
    try {
      const res = await hrAPI.generatePayslip(employeeId, month);
      setPayslip(res.data);
      setMsg("Payslip generated successfully!");
    } catch (err) {
      setMsg(err.response?.data || "Failed to generate payslip. Ensure salary details exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Payroll Processing</h1>
      </div>

      {/* Generate Payslip */}
      <div className="section-card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Generate Payslip</h2>
        <form onSubmit={handleGenerate} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Employee ID
            </label>
            <input
              type="number"
              className="form-input w-40"
              placeholder="e.g., 5"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Month
            </label>
            <input
              type="text"
              className="form-input w-40"
              placeholder="e.g., May-2026"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
      </div>

      {msg && (
        <div
          className={`mb-6 p-3 rounded-xl text-sm ${
            msg.includes("success")
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Generated Payslip Details */}
      {payslip && (
        <div className="section-card">
          <h2 className="text-lg font-semibold text-white mb-6">
            Payslip — {payslip.month}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="text-xl font-bold text-white">#{payslip.employeeId}</p>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Gross Salary</p>
              <p className="text-xl font-bold text-emerald-400">₹{payslip.grossSalary?.toLocaleString()}</p>
            </div>
            <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20">
              <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Deductions</p>
              <p className="text-xl font-bold text-red-400">₹{payslip.totalDeductions?.toLocaleString()}</p>
            </div>
            <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/20">
              <p className="text-xs text-indigo-400 uppercase tracking-wider mb-1">Net Salary</p>
              <p className="text-xl font-bold text-indigo-400">₹{payslip.netSalary?.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Absent Days</p>
            <p className="text-lg font-bold text-amber-400">{payslip.absentDays} days</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default HrPayroll;
