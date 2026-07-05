import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertMessage } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [show, setShow] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const submit = async (e) => { e.preventDefault(); setLoading(true); setError(""); try { await login(form.email, form.password); navigate(location.state?.from || "/"); } catch (err) { setError(err.response?.data?.message || "Login failed."); } finally { setLoading(false); } };
  return <div className="auth-screen"><section className="auth-visual"><span>BookStore</span><h1>Welcome back to your reading shelf.</h1><p>Login to review books, place orders, and manage your profile.</p></section><form className="auth-card" onSubmit={submit}><span className="eyebrow">Secure login</span><h2>Login</h2><AlertMessage>{error}</AlertMessage><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>Password<div className="password-field"><input type={show ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button></div></label><div className="form-row"><label className="check"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label><button className="link-button" type="button">Forgot Password?</button></div><button className="btn btn-gold w-100" disabled={loading}>{loading ? "Signing in..." : "Login"}</button><p>New here? <Link to="/register">Create an account</Link></p></form></div>;
}

