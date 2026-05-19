import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { employeeApi } from "../api/employeeApi.js";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function EmployeePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await employeeApi.listEmployees();
      setEmployees(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (logoutError) {
      setError(logoutError.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      if (selectedEmployee) {
        await employeeApi.updateEmployee(selectedEmployee.id, values);
        setSelectedEmployee(null);
        setSuccessMessage("Employee updated successfully.");
      } else {
        await employeeApi.createEmployee(values);
        setSuccessMessage("Employee created successfully.");
      }

      await fetchEmployees();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(`Delete ${employee.full_name}? This will deactivate the employee record.`);

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await employeeApi.deleteEmployee(employee.id);
      if (selectedEmployee?.id === employee.id) {
        setSelectedEmployee(null);
      }
      setSuccessMessage("Employee deleted successfully.");
      await fetchEmployees();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="page-shell">
      <header className="hero">
        <div className="hero-topline">
          <div>
            <p className="eyebrow">Phase 1</p>
            <h1>Employee Management</h1>
            <p>
              Manage employee profiles, private Supabase photo storage, and unique card numbers for future recognition
              workflows.
            </p>
          </div>
          <button className="secondary-button" disabled={isLoggingOut} type="button" onClick={handleLogout}>
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
        <div className="hero-metrics">
          <div className="metric-card">
            <span>{employees.length}</span>
            <p>Active employees</p>
          </div>
          <div className="metric-card">
            <span>{employees.filter((employee) => employee.photo_url).length}</span>
            <p>Profiles with photos</p>
          </div>
          {user?.email ? (
            <div className="metric-card metric-wide">
              <span>Admin</span>
              <p>{user.email}</p>
            </div>
          ) : null}
        </div>
      </header>

      {error ? <div className="alert error-alert">{error}</div> : null}
      {successMessage ? <div className="alert success-alert">{successMessage}</div> : null}

      <section className="layout-grid">
        <EmployeeForm
          employee={selectedEmployee}
          isSubmitting={isSubmitting}
          onCancelEdit={() => setSelectedEmployee(null)}
          onSubmit={handleSubmit}
        />

        <div>
          {isLoading ? (
            <div className="card loading-card">Loading employees...</div>
          ) : (
            <EmployeeTable employees={employees} onDelete={handleDelete} onEdit={setSelectedEmployee} />
          )}
        </div>
      </section>
    </main>
  );
}

export default EmployeePage;
