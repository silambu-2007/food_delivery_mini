import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      return setError("Please enter your email and password");
    }
    setError("");
    setLoading(true);
    const { ok, data } = await loginUser(form);
    setLoading(false);

    if (ok) {
      onLogin(data.user); // saves userId in localStorage
      navigate("/menu");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="card form-card auth-card">
      <h2>Welcome back</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
      <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
