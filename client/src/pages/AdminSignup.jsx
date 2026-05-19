import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminSignup() {
  const { isAuthenticated, loading, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate replace to="/employees" />;
  }

  const validateForm = () => {
    if (!email.trim()) {
      return "Email is required.";
    }

    if (!fullName.trim()) {
      return "Full name is required.";
    }

    if (!password) {
      return "Password is required.";
    }

    if (!confirmPassword) {
      return "Confirm password is required.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await signup({ email, fullName, password });
      navigate(session ? "/employees" : "/login", { replace: true });
    } catch (signupError) {
      setError(signupError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-visual signup-visual" aria-hidden="true">
          <div className="visual-badge">Secure admin workspace</div>
          <div className="visual-card">
            <span className="visual-avatar">SM</span>
            <div>
              <strong>Staff operations</strong>
              <p>Profiles, photos, and card numbers in one protected dashboard.</p>
            </div>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Admin access</p>
            <h1>Create admin account</h1>
            <p className="muted-text">Register a protected admin profile for employee management.</p>
          </div>

          {error ? <div className="alert error-alert">{error}</div> : null}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Full name
            <input
              autoComplete="name"
              name="fullName"
              required
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="new-password"
              name="password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <label>
            Confirm password
            <input
              autoComplete="new-password"
              name="confirmPassword"
              required
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>

          <button className="primary-button" disabled={isSubmitting || loading} type="submit">
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default AdminSignup;
