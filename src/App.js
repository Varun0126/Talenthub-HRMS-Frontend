import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./pages/Login";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCompanies from "./pages/AdminCompanies";
import AdminUsers from "./pages/AdminUsers";

// Company
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyHRs from "./pages/CompanyHRs";
import CompanyDepartments from "./pages/CompanyDepartments";
import CompanyDesignations from "./pages/CompanyDesignations";

// HR
import HrDashboard from "./pages/HrDashboard";
import HrEmployees from "./pages/HrEmployees";
import HrLeaves from "./pages/HrLeaves";
import HrSalary from "./pages/HrSalary";
import HrPayroll from "./pages/HrPayroll";

// Employee
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeAttendance from "./pages/EmployeeAttendance";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import EmployeePayslips from "./pages/EmployeePayslips";
import EmployeeDocuments from "./pages/EmployeeDocuments";
import EmployeeBankDetails from "./pages/EmployeeBankDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/hrs"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyHRs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/departments"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/designations"
            element={
              <ProtectedRoute allowedRoles={["COMPANY"]}>
                <CompanyDesignations />
              </ProtectedRoute>
            }
          />

          {/* HR Routes */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <HrDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <HrEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/leaves"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <HrLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/salary"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <HrSalary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/payroll"
            element={
              <ProtectedRoute allowedRoles={["HR"]}>
                <HrPayroll />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leaves"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/payslips"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeePayslips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/documents"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeDocuments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/bank"
            element={
              <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
                <EmployeeBankDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;