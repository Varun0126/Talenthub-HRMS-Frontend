import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Automatically attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for auth errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

// ====== AUTH ======
export const authAPI = {
  login: (email, password) => API.post("/auth/login", { email, password }),
  changePassword: (email, newPassword) =>
    API.post("/auth/change-password", { email, newPassword }),
  registerCompany: (name, email, password) =>
    API.post("/auth/register-company", { name, email, password }),
};

// ====== ADMIN ======
export const adminAPI = {
  getDashboard: () => API.get("/admin/dashboard"),
  getCompanies: () => API.get("/admin/companies"),
  createCompany: (name, email) =>
    API.post("/admin/create-company", { name, email }),
  toggleCompany: (id) => API.put(`/admin/toggle-company/${id}`),
  activateCompany: (id) => API.put(`/admin/activate-company/${id}`),
  getAllUsers: () => API.get("/users"),
};

// ====== COMPANY ======
export const companyAPI = {
  getDashboard: () => API.get("/company/dashboard"),
  createHR: (name, email) => API.post("/company/create-hr", { name, email }),
  getDepartments: () => API.get("/company/departments"),
  createDepartment: (name) =>
    API.post("/company/departments", { name }),
  deleteDepartment: (id) => API.delete(`/company/departments/${id}`),
  getDesignations: () => API.get("/company/designations"),
  createDesignation: (title) =>
    API.post("/company/designations", { title }),
  deleteDesignation: (id) => API.delete(`/company/designations/${id}`),
};

// ====== HR ======
export const hrAPI = {
  getDashboard: () => API.get("/hr/dashboard"),
  createEmployee: (data) => API.post("/hr/create-employee", data),
  getAllLeaves: () => API.get("/hr/leaves"),
  approveLeave: (id) => API.put(`/hr/leaves/approve/${id}`),
  rejectLeave: (id) => API.put(`/hr/leaves/reject/${id}`),
  saveSalary: (details) => API.post("/hr/salary", details),
  getSalary: (employeeId) => API.get(`/hr/salary/${employeeId}`),
  generatePayslip: (employeeId, month) =>
    API.post("/hr/payslip/generate", { employeeId: String(employeeId), month }),
};

// ====== EMPLOYEE ======
export const employeeAPI = {
  getDashboard: () => API.get("/employee/dashboard"),
  // Profile
  getProfile: () => API.get("/employee/profile"),
  saveProfile: (profile) => API.post("/employee/profile", profile),
  // Attendance
  getAttendance: () => API.get("/employee/attendance"),
  clockIn: () => API.post("/employee/attendance/clock-in"),
  clockOut: () => API.post("/employee/attendance/clock-out"),
  // Leaves
  getLeaves: () => API.get("/employee/leaves"),
  applyLeave: (leave) => API.post("/employee/leaves", leave),
  // Payslips
  getPayslips: () => API.get("/employee/payslips"),
  downloadPayslip: (id) =>
    API.get(`/employee/payslips/download/${id}`, { responseType: "blob" }),
  // Bank Details
  getBankDetails: () => API.get("/employee/bank-details"),
  saveBankDetails: (details) => API.post("/employee/bank-details", details),
  // Documents
  getDocuments: () => API.get("/employee/documents"),
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/employee/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ====== USERS ======
export const userAPI = {
  getMe: () => API.get("/users/me"),
  getAll: () => API.get("/users"),
  // 🔥 COMPANY-SCOPED
  getByCompany: () => API.get("/users/company"),
  getByRoleAndCompany: (role) => API.get(`/users/company/role/${role}`),
};

export default API;