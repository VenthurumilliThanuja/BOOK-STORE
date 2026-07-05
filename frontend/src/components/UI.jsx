import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { bookImage, money, statusTone } from "../utils/format.js";

export function AnnouncementBar() {
  return <div className="announcement-bar">Free shipping on orders above Rs. 999 | Secure checkout | College MERN project demo</div>;
}

export function AppNavbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/books${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <nav className={`navbar navbar-expand-lg app-navbar sticky-top ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand brand-mark" to="/"><span>BS</span>BookStore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-lg-3 mb-3 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/books">Books</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/books?genre=Fiction">Categories</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/orders">My Orders</NavLink></li>}
            {isAdmin && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
          </ul>
          <form className="nav-search me-lg-auto" onSubmit={submit} role="search">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search books, authors..." aria-label="Search books" />
            <button aria-label="Search">Search</button>
          </form>
          <div className="nav-actions">
            <Link className="cart-button" to="/cart" aria-label="Shopping cart"><span>Cart</span><strong>{itemCount}</strong></Link>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-sm btn-ink dropdown-toggle" data-bs-toggle="dropdown">{user.name}</button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  {isAdmin && <li><Link className="dropdown-item" to="/admin">Admin Dashboard</Link></li>}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                </ul>
              </div>
            ) : <><Link className="btn btn-sm btn-ghost" to="/login">Login</Link><Link className="btn btn-sm btn-gold" to="/register">Register</Link></>}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const categories = ["Fiction", "Technology", "Science", "Business", "History", "Self Help"];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><Link className="brand-mark footer-brand" to="/"><span>BS</span>BookStore</Link><p>Premium MERN stack bookstore experience for browsing, reviewing, and ordering books online.</p></div>
        <div><h3>Quick Links</h3><Link to="/books">Books</Link><Link to="/cart">Cart</Link><Link to="/orders">Orders</Link><Link to="/profile">Profile</Link></div>
        <div><h3>Categories</h3>{categories.map((cat) => <Link key={cat} to={`/books?genre=${cat}`}>{cat}</Link>)}</div>
        <div><h3>Support</h3><p>Email: support@bookstore.local</p><p>Phone: +91 99999 99999</p><p>Hyderabad, India</p><div className="socials"><span>f</span><span>in</span><span>x</span></div></div>
      </div>
      <div className="footer-bottom">Copyright 2026 BookStore. Built with MongoDB, Express, React, and Node.</div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return <section className="page-header"><div><span>{eyebrow}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{children}</section>;
}

export function Breadcrumbs({ items = [] }) {
  return <nav aria-label="breadcrumb"><ol className="breadcrumb small"><li className="breadcrumb-item"><Link to="/">Home</Link></li>{items.map((item, index) => <li className={`breadcrumb-item ${index === items.length - 1 ? "active" : ""}`} key={item.label}>{item.to && index !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}</li>)}</ol></nav>;
}

export function RatingStars({ value = 0, count }) {
  const rounded = Math.round(value);
  return (
    <span className="rating" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rounded ? "star filled" : "star empty"}>
          {i < rounded ? "★" : "☆"}
        </span>
      ))}
      <small>{Number(value).toFixed(1)}{count !== undefined ? ` (${count})` : ""}</small>
    </span>
  );
}

export function StatusBadge({ status }) {
  return <span className={`status-badge ${statusTone(status)}`}>{status}</span>;
}

export function LoadingSpinner() { return <div className="loader-wrap"><div className="spinner-border" role="status" /><span>Loading BookStore...</span></div>; }
export function AlertMessage({ type = "danger", children }) { return children ? <div className={`alert alert-${type}`}>{children}</div> : null; }
export function EmptyState({ title, text, actionLabel, to }) { return <div className="empty-state"><div className="empty-icon">Book</div><h2>{title}</h2><p>{text}</p>{to && <Link className="btn btn-gold" to={to}>{actionLabel}</Link>}</div>; }
export function ErrorState({ message, onRetry }) { return <div className="empty-state error"><div className="empty-icon">!</div><h2>Something went wrong</h2><p>{message}</p>{onRetry && <button className="btn btn-ink" onClick={onRetry}>Retry</button>}</div>; }
export function BookCardSkeleton() { return <div className="book-card skeleton"><div className="cover" /><div className="line w-75" /><div className="line w-50" /><div className="line" /></div>; }

export function QuantitySelector({ value, min = 1, max = 99, onChange }) {
  return <div className="qty-control"><button type="button" onClick={() => onChange(Math.max(min, value - 1))}>-</button><input aria-label="Quantity" value={value} onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))} /><button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button></div>;
}

export function BookCard({ book, onAdd }) {
  return (
    <article className="book-card">
      <Link className="cover-wrap" to={`/books/${book._id}`}><img src={bookImage(book.image)} alt={`${book.title} cover`} /><button type="button" className="wishlist" aria-label="Add to wishlist"><span aria-hidden="true">♡</span></button></Link>
      <div className="book-body"><span className="genre-pill">{book.genre}</span><h3><Link to={`/books/${book._id}`}>{book.title}</Link></h3><p className="author">{book.author}</p><RatingStars value={book.rating || 0} /><div className="book-meta"><strong>{money(book.price)}</strong><span className={book.stock > 0 ? "in-stock" : "out-stock"}>{book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}</span></div></div>
      <div className="book-actions"><button className="btn btn-gold" disabled={book.stock === 0} onClick={() => onAdd?.(book)}>Add to Cart</button><Link className="btn btn-ghost" to={`/books/${book._id}`}>Details</Link></div>
    </article>
  );
}

export function OrderSummary({ subtotal, shipping, total, button, note }) {
  return <aside className="summary-card"><h2>Order Summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? money(shipping) : "Free"}</strong></div><hr /><div className="total"><span>Total</span><strong>{money(total)}</strong></div>{note && <p className="summary-note">{note}</p>}{button}</aside>;
}

export function AdminShell({ active, setActive, children }) {
  const nav = ["Dashboard", "Books", "Add Book", "Orders", "Users", "Reviews"];
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="brand-mark" to="/"><span>BS</span>Admin</Link>{nav.map((item) => <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>{item}</button>)}</aside><section className="admin-content"><div className="admin-header"><div><span>BookStore Control</span><h1>{active}</h1></div><Link className="btn btn-ghost" to="/">Storefront</Link></div>{children}</section></div>;
}

export function StatCard({ label, value }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>; }


