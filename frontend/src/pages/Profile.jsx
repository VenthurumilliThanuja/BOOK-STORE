import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertMessage, StatusBadge } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { money, shortId } from "../utils/format.js";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email }); const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" }); const [orders, setOrders] = useState([]); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { api.get("/orders").then(({ data }) => setOrders(data.slice(0, 3))).catch(() => {}); }, []);
  const updateProfile = async (e) => { e.preventDefault(); try { const { data } = await api.put("/auth/profile", form); setUser(data); setMessage("Profile updated."); } catch (err) { setError(err.response?.data?.message || "Update failed."); } };
  const changePassword = async (e) => { e.preventDefault(); try { await api.put("/auth/change-password", passwords); setPasswords({ currentPassword: "", newPassword: "" }); setMessage("Password changed."); } catch (err) { setError(err.response?.data?.message || "Password update failed."); } };
  return <div className="container section"><span className="eyebrow">Reader dashboard</span><h1>My Profile</h1><AlertMessage type="success">{message}</AlertMessage><AlertMessage>{error}</AlertMessage><div className="profile-grid"><section className="profile-card"><h2>Account Summary</h2><div className="avatar">{user.name.charAt(0)}</div><h3>{user.name}</h3><p>{user.email}</p><StatusBadge status={user.role} /><button className="btn btn-ghost" onClick={logout}>Logout</button></section><form className="profile-card" onSubmit={updateProfile}><h2>Edit Profile</h2><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><button className="btn btn-gold">Save Changes</button></form><form className="profile-card" onSubmit={changePassword}><h2>Change Password</h2><label>Current Password<input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label><label>New Password<input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></label><button className="btn btn-ink">Update Password</button></form><section className="profile-card recent-orders"><h2>Recent Orders</h2>{orders.map((order) => <Link to={`/orders/${order._id}`} key={order._id}><span>{shortId(order._id)}</span><strong>{money(order.totalAmount)}</strong><StatusBadge status={order.orderStatus} /></Link>)}</section></div></div>;
}

