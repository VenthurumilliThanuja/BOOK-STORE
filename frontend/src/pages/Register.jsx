import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" }); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { register } = useAuth(); const navigate = useNavigate();
  const submit = async (e) => { e.preventDefault(); if (form.password.length < 6) return setError("Password must be at least 6 characters."); setLoading(true); setError(""); try { await register(form.name, form.email, form.password); navigate("/"); } catch (err) { setError(err.response?.data?.message || "Registration failed."); } finally { setLoading(false); } };
  return <div className="auth-screen"><section className="auth-visual"><span>Join BookStore</span><h1>Build your personal reading journey.</h1><p>Create an account to order books and contribute trusted reviews.</p></section><form className="auth-card" onSubmit={submit}><span className="eyebrow">Reader account</span><h2>Register</h2><AlertMessage>{error}</AlertMessage><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>Password<div className="password-field"><input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></div></label><button className="btn btn-gold w-100" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button><p>Already registered? <Link to="/login">Login</Link></p></form></div>;
}

