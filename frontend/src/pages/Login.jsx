// frontend/src/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/games";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(form);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <main className="form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Login</h1>

        {error && (
          <div className="error-state" style={{ padding: "1rem" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="link">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
