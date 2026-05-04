import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeeBankDetails() {
  const [details, setDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panNumber: "",
    uanNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    employeeAPI
      .getBankDetails()
      .then((res) => {
        if (res.data) {
          setDetails(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await employeeAPI.saveBankDetails(details);
      setDetails(res.data);
      setMsg("Bank details saved successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data || "Failed to save bank details");
    } finally {
      setSaving(false);
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
        <h1 className="page-title">Bank Details</h1>
      </div>

      <div className="section-card max-w-2xl">
        {msg && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm ${
              msg.includes("success")
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="bankName">
                Bank Name
              </label>
              <input
                id="bankName"
                className="form-input"
                placeholder="e.g., State Bank of India"
                value={details.bankName || ""}
                onChange={(e) =>
                  setDetails({ ...details, bankName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="accountNumber">
                Account Number
              </label>
              <input
                id="accountNumber"
                className="form-input"
                placeholder="Enter account number"
                value={details.accountNumber || ""}
                onChange={(e) =>
                  setDetails({ ...details, accountNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="ifscCode">
                IFSC Code
              </label>
              <input
                id="ifscCode"
                className="form-input"
                placeholder="e.g., SBIN0001234"
                value={details.ifscCode || ""}
                onChange={(e) =>
                  setDetails({ ...details, ifscCode: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="panNumber">
                PAN Number
              </label>
              <input
                id="panNumber"
                className="form-input"
                placeholder="e.g., ABCDE1234F"
                value={details.panNumber || ""}
                onChange={(e) =>
                  setDetails({ ...details, panNumber: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="uanNumber">
                UAN Number
              </label>
              <input
                id="uanNumber"
                className="form-input"
                placeholder="Enter UAN number"
                value={details.uanNumber || ""}
                onChange={(e) =>
                  setDetails({ ...details, uanNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeBankDetails;
