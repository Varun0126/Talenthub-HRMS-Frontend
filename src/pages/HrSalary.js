import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { hrAPI } from "../api/api";

function HrSalary() {
  const [employeeId, setEmployeeId] = useState("");
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    basicSalary: "",
    hra: "",
    allowances: "",
    bonus: "",
    pfDeduction: "",
    taxDeduction: "",
    absentDeductionPerDay: "",
    perDaySalary: "",
  });

  const fetchSalary = async () => {
    if (!employeeId) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await hrAPI.getSalary(employeeId);
      const data = res.data;
      if (data) {
        setSalary(data);
        setForm({
          basicSalary: data.basicSalary || "",
          hra: data.hra || "",
          allowances: data.allowances || "",
          bonus: data.bonus || "",
          pfDeduction: data.pfDeduction || "",
          taxDeduction: data.taxDeduction || "",
          absentDeductionPerDay: data.absentDeductionPerDay || "",
          perDaySalary: data.perDaySalary || "",
        });
      } else {
        setSalary(null);
        setForm({
          basicSalary: "",
          hra: "",
          allowances: "",
          bonus: "",
          pfDeduction: "",
          taxDeduction: "",
          absentDeductionPerDay: "",
          perDaySalary: "",
        });
      }
    } catch (err) {
      setSalary(null);
      setMsg("No salary record found. You can create one.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...(salary?.id && { id: salary.id }),
        employeeId: Number(employeeId),
        basicSalary: Number(form.basicSalary),
        hra: Number(form.hra),
        allowances: Number(form.allowances),
        bonus: Number(form.bonus),
        pfDeduction: Number(form.pfDeduction),
        taxDeduction: Number(form.taxDeduction),
        absentDeductionPerDay: Number(form.absentDeductionPerDay),
        perDaySalary: Number(form.perDaySalary),
      };
      await hrAPI.saveSalary(payload);
      setMsg("Salary details saved successfully!");
      fetchSalary();
    } catch (err) {
      setMsg(err.response?.data || "Failed to save salary details");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Salary Setup</h1>
      </div>

      {/* Employee Search */}
      <div className="section-card mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Find Employee
        </h2>
        <div className="flex gap-3">
          <input
            className="form-input max-w-xs"
            placeholder="Enter Employee ID"
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <button onClick={fetchSalary} className="btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Fetch Salary"}
          </button>
        </div>
      </div>

      {/* Salary Form */}
      {employeeId && !loading && (
        <div className="section-card">
          <h2 className="text-lg font-semibold text-white mb-6">
            Salary Details — Employee #{employeeId}
          </h2>

          {msg && (
            <div
              className={`mb-4 p-3 rounded-xl text-sm ${
                msg.includes("success")
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              }`}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Earnings
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "basicSalary", label: "Basic Salary" },
                    { key: "hra", label: "HRA" },
                    { key: "allowances", label: "Allowances" },
                    { key: "bonus", label: "Bonus" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        {f.label}
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0.00"
                        value={form[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Deductions & Payroll
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "pfDeduction", label: "PF Deduction" },
                    { key: "taxDeduction", label: "Tax Deduction" },
                    { key: "absentDeductionPerDay", label: "Absent Deduction/Day" },
                    { key: "perDaySalary", label: "Per Day Salary" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        {f.label}
                      </label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0.00"
                        value={form[f.key]}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Salary Details"}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

export default HrSalary;
