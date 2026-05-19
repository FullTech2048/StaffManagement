import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminSignup from "./pages/AdminSignup.jsx";
import EmployeePage from "./pages/EmployeePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<EmployeePage />} path="/employees" />
      </Route>
      <Route element={<LoginPage />} path="/login" />
      <Route element={<AdminSignup />} path="/signup" />
      <Route element={<Navigate replace to="/employees" />} path="*" />
    </Routes>
  );
}

export default App;
