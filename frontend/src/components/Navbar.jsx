import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">BookStore</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/books">Books</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/cart">Cart ({cart.length})</NavLink></li>
            {user && <li className="nav-item"><NavLink className="nav-link" to="/orders">Orders</NavLink></li>}
            {user?.role === "admin" && <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>}
          </ul>
          <div className="d-flex gap-2">
            {user ? (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/profile">{user.name}</Link>
                <button className="btn btn-warning btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                <Link className="btn btn-warning btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

