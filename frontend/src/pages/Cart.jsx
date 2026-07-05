import { Link } from "react-router-dom";
import { EmptyState, OrderSummary, QuantitySelector } from "../components/UI.jsx";
import { useCart } from "../context/CartContext.jsx";
import { bookImage, money } from "../utils/format.js";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, shipping, total } = useCart();
  if (!cart.length) return <div className="container section"><EmptyState title="Your cart is waiting" text="Add a few books and your saved cart will appear here after refresh too." to="/books" actionLabel="Browse Books" /></div>;
  return <div className="container section"><div className="cart-heading"><div><span className="eyebrow">Shopping bag</span><h1>Your Cart</h1></div><button className="btn btn-ghost" onClick={clearCart}>Clear Cart</button></div><div className="cart-layout"><section>{cart.map((item) => <article className="cart-item" key={item._id}><img src={bookImage(item.image)} alt={`${item.title} cover`} /><div><h2>{item.title}</h2><p>{item.author}</p><strong>{money(item.price)}</strong></div><QuantitySelector value={item.quantity} max={item.stock || 99} onChange={(qty) => updateQuantity(item._id, qty)} /><div className="subtotal"><span>Subtotal</span><strong>{money(item.price * item.quantity)}</strong></div><button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button></article>)}</section><OrderSummary subtotal={subtotal} shipping={shipping} total={total} note="Shipping is free above Rs. 999." button={<Link className="btn btn-gold w-100" to="/checkout">Proceed to Checkout</Link>} /><Link className="continue-link" to="/books">Continue Shopping</Link></div></div>;
}

