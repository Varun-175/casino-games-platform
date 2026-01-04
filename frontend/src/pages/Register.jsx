// frontend/src/pages/Register.jsx

import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register(form);

    if (res.success) {
      navigate("/games", { replace: true });
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <main className="form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Create Account</h1>

        {error && (
          <div className="error-state" style={{ padding: "1rem" }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

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
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
