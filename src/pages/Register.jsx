import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Returns an object of error messages (empty object = valid)
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email)) e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!PHONE_REGEX.test(form.phone)) e.phone = "Phone number must be 10 digits";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { confirm, ...userData } = form; // confirm password is not sent to the server
    const { ok, data } = await registerUser(userData);
    setLoading(false);

    if (ok) {
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setServerError(data.message || "Registration failed");
    }
  };

  const field = (name, label, type = "text", extra = {}) => (
    <label>
      {label}
      <input name={name} type={type} value={form[name]} onChange={handleChange} className={errors[name] ? "invalid" : ""} {...extra} />
      {errors[name] && <small className="field-error">{errors[name]}</small>}
    </label>
  );

  return (
    <div className="card form-card auth-card">
      <h2>Create your account</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {serverError && <div className="alert alert-error">{serverError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {field("name", "Full name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone number", "tel", { maxLength: 10 })}
        <label>
          Address
          <textarea name="address" rows="2" value={form.address} onChange={handleChange} className={errors.address ? "invalid" : ""} />
          {errors.address && <small className="field-error">{errors.address}</small>}
        </label>
        {field("password", "Password", "password")}
        {field("confirm", "Confirm password", "password")}
        <button className="btn btn-primary btn-block" disabled={loading || !!success}>
          {loading ? "Registering…" : "Register"}
        </button>
      </form>
      <p className="muted center">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
