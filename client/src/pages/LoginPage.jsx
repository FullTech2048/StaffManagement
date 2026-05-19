import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/employees";

  if (!loading && isAuthenticated) {
    return <Navigate replace to={redirectTo} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Admin access</p>
          <h1>Sign in</h1>
          <p className="muted-text">Use your Supabase Auth admin account to manage employees.</p>
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
          Password
          <input
            autoComplete="current-password"
            name="password"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button className="primary-button" disabled={isSubmitting || loading} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-link">
          Need an admin account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
