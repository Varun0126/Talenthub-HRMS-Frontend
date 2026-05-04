import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMsg, setRegMsg] = useState("");

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [cpMsg, setCpMsg] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(email, password);
      const data = res.data;

      // Check if first login - requires password change
      if (data === "CHANGE_PASSWORD_REQUIRED") {
        setChangeEmail(email);
        setShowChangePassword(true);
        setLoading(false);
        return;
      }

      const token = data;
      const role = await login(token);

      // Role-based redirect
      const routes = {
        ADMIN: "/admin",
        COMPANY: "/company",
        HR: "/hr",
        EMPLOYEE: "/employee",
      };

      navigate(routes[role] || "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg("");

    try {
      await authAPI.registerCompany(regName, regEmail, regPassword);
      setRegMsg("Registration successful! Waiting for admin approval.");
      setTimeout(() => {
        setShowRegister(false);
        setRegMsg("");
      }, 2500);
    } catch (err) {
      setRegMsg(err.response?.data || "Registration failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCpMsg("");

    try {
      await authAPI.changePassword(changeEmail, newPassword);
      setCpMsg("Password changed! Please login again.");
      setTimeout(() => {
        setShowChangePassword(false);
        setCpMsg("");
        setPassword("");
      }, 2000);
    } catch (err) {
      setCpMsg(err.response?.data || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse-glow">
            <span className="text-2xl font-black text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">TalentHub</h1>
          <p className="text-slate-500 text-sm">Human Resource Management System</p>
        </div>

        {/* Login Form */}
        {!showRegister && !showChangePassword && (
          <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-400 mb-6">Sign in to your account</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="login-email">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@company.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Register your company?{" "}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {showRegister && (
          <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-1">Register Company</h2>
            <p className="text-sm text-slate-400 mb-6">Create a new company account</p>

            {regMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${
                regMsg.includes("successful")
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {regMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="reg-name">
                  Company Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Acme Corp"
                  className="form-input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="reg-email">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="admin@company.com"
                  className="form-input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="reg-password">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Register
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowRegister(false)}
                className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        {showChangePassword && (
          <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-1">Change Password</h2>
            <p className="text-sm text-slate-400 mb-6">
              First login detected. Please set a new password.
            </p>

            {cpMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm ${
                cpMsg.includes("changed")
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}>
                {cpMsg}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5" htmlFor="new-password">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Update Password
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-sm text-slate-500 hover:text-slate-400 transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;