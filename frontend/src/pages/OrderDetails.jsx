import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorState, LoadingSpinner, StatusBadge } from "../components/UI.jsx";
import api from "../services/api.js";
import { money, shortId } from "../utils/format.js";

export default function OrderDetails() {
  const { id } = useParams(); const [order, setOrder] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get("/orders").then(({ data }) => setOrder((data || []).find((item) => item._id === id))).catch(() => setError("Unable to load order.")); }, [id]);
  if (error) return <div className="container section"><ErrorState message={error} /></div>; if (!order) return <LoadingSpinner />;
  return <div className="container section"><span className="eyebrow">Order details</span><h1>{shortId(order._id)}</h1><div className="detail-panels"><section><h2>Ordered Books</h2>{order.books.map((item) => <div className="order-line" key={item.book?._id || item.title}><span>{item.title} x {item.quantity}</span><strong>{money(item.price * item.quantity)}</strong></div>)}<hr /><strong>Total: {money(order.totalAmount)}</strong></section><section><h2>Shipping Address</h2><p>{order.shippingAddress?.fullName}</p><p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p><p>{order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p></section><section><h2>Status Timeline</h2><div className="timeline"><span className="active">Placed</span><span className={order.orderStatus !== "Placed" ? "active" : ""}>Processing</span><span className={["Shipped", "Delivered"].includes(order.orderStatus) ? "active" : ""}>Shipped</span><span className={order.orderStatus === "Delivered" ? "active" : ""}>Delivered</span></div><StatusBadge status={order.paymentStatus} /> <StatusBadge status={order.orderStatus} /></section></div></div>;
}

