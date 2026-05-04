import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeeProfile() {
  const [profile, setProfile] = useState({
    fatherName: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContact: "",
    dob: "",
    joiningDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    employeeAPI
      .getProfile()
      .then((res) => {
        if (res.data) {
          setProfile({
            ...res.data,
            dob: res.data.dob || "",
            joiningDate: res.data.joiningDate || "",
          });
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
      const res = await employeeAPI.saveProfile(profile);
      setProfile(res.data);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data || "Failed to save profile");
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
        <h1 className="page-title">My Profile</h1>
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
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="fatherName">
                Father's Name
              </label>
              <input
                id="fatherName"
                className="form-input"
                placeholder="Enter father's name"
                value={profile.fatherName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, fatherName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="form-input"
                value={profile.gender || ""}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="form-input"
                placeholder="Enter phone number"
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="emergencyContact">
                Emergency Contact
              </label>
              <input
                id="emergencyContact"
                className="form-input"
                placeholder="Emergency contact number"
                value={profile.emergencyContact || ""}
                onChange={(e) =>
                  setProfile({ ...profile, emergencyContact: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="dob">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="form-input"
                value={profile.dob || ""}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="joiningDate">
                Joining Date
              </label>
              <input
                id="joiningDate"
                type="date"
                className="form-input"
                value={profile.joiningDate || ""}
                onChange={(e) =>
                  setProfile({ ...profile, joiningDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              className="form-input min-h-[80px] resize-none"
              placeholder="Enter your address"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeProfile;
