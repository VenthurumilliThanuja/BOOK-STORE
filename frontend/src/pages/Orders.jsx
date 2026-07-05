import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingSpinner, StatusBadge } from "../components/UI.jsx";
import api from "../services/api.js";
import { money, shortId } from "../utils/format.js";

export default function Orders() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = () => { setLoading(true); api.get("/orders").then(({ data }) => setOrders(data || [])).catch(() => setError("Unable to load orders.")) .finally(() => setLoading(false)); };
  useEffect(load, []);
  const cancel = async (id) => { await api.put(`/orders/${id}/cancel`); load(); };
  if (loading) return <LoadingSpinner />; if (error) return <div className="container section"><ErrorState message={error} onRetry={load} /></div>;
  return <div className="container section"><span className="eyebrow">Account</span><h1>My Orders</h1>{orders.length ? <div className="order-list">{orders.map((order) => <article className="order-card" key={order._id}><div><strong>{shortId(order._id)}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><div><span>{order.books.length} items</span><strong>{money(order.totalAmount)}</strong></div><StatusBadge status={order.paymentStatus} /><StatusBadge status={order.orderStatus} /><Link className="btn btn-ghost" to={`/orders/${order._id}`}>View Details</Link>{["Placed", "Processing"].includes(order.orderStatus) && <button className="btn btn-danger-soft" onClick={() => cancel(order._id)}>Cancel</button>}</article>)}</div> : <EmptyState title="No orders yet" text="Your placed orders will appear here." to="/books" actionLabel="Start Shopping" />}</div>;
}

