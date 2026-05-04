import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeePayslips() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    employeeAPI
      .getPayslips()
      .then((res) => setPayslips(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    setDownloading(id);
    try {
      const res = await employeeAPI.downloadPayslip(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download payslip");
    } finally {
      setDownloading(null);
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
        <h1 className="page-title">My Payslips</h1>
      </div>

      {payslips.length === 0 ? (
        <div className="section-card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
          <p className="text-slate-500">No payslips available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payslips.map((p) => (
            <div key={p.id} className="glass-card p-5 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Month</p>
                  <p className="text-lg font-bold text-white">{p.month}</p>
                </div>
                <span className="badge-info">#{p.id}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Gross</span>
                  <span className="text-emerald-400 font-medium">
                    ₹{p.grossSalary?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Deductions</span>
                  <span className="text-red-400 font-medium">
                    -₹{p.totalDeductions?.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-700/50 pt-2 flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Net Salary</span>
                  <span className="text-indigo-400 font-bold">
                    ₹{p.netSalary?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Absent Days</span>
                  <span className="text-amber-400">{p.absentDays}</span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(p.id)}
                disabled={downloading === p.id}
                className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {downloading === p.id ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default EmployeePayslips;
