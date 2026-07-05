import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertMessage, EmptyState, OrderSummary } from "../components/UI.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

const blank = { fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India" };

export default function Checkout() {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const [address, setAddress] = useState(blank);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  if (!cart.length) return <div className="container section"><EmptyState title="Checkout needs books" text="Your cart is empty." to="/books" actionLabel="Browse Books" /></div>;

  const validate = () => { const next = {}; ["fullName", "phone", "address", "city", "state", "postalCode"].forEach((k) => { if (!address[k].trim()) next[k] = "Required"; }); setErrors(next); return Object.keys(next).length === 0; };
  const submit = async (e) => { e.preventDefault(); if (!validate()) return; setLoading(true); setApiError(""); try { const { data } = await api.post("/orders", { books: cart.map((item) => ({ book: item._id, quantity: item.quantity })), shippingAddress: address }); clearCart(); navigate(`/order-success/${data._id}`); } catch (err) { setApiError(err.response?.data?.message || "Order placement failed."); } finally { setLoading(false); } };

  return <div className="container section"><span className="eyebrow">Secure checkout</span><h1>Checkout</h1><AlertMessage>{apiError}</AlertMessage><div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><section><h2>Shipping Information</h2>{Object.keys(blank).map((key) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<input value={address[key]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} className={errors[key] ? "invalid" : ""} />{errors[key] && <small>{errors[key]}</small>}</label>)}</section><section><h2>Payment Method</h2><div className="payment-demo"><strong>Dummy Payment Success</strong><p>No real payment gateway is used. This is a frontend/backend demonstration flow.</p></div></section><button className="btn btn-gold" disabled={loading}>{loading ? "Placing Order..." : "Place Order"}</button></form><div><OrderSummary subtotal={subtotal} shipping={shipping} total={total} note="Review your books before placing the order." /><Link className="continue-link" to="/cart">Back to Cart</Link></div></div></div>;
}

