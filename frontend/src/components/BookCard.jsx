import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const apiRoot = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const image = book.image?.startsWith("/uploads") ? `${apiRoot}${book.image}` : book.image;

  return (
    <div className="card h-100 book-card">
      <img src={image || "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"} className="card-img-top" alt={book.title} />
      <div className="card-body d-flex flex-column">
        <span className="badge text-bg-secondary align-self-start mb-2">{book.genre}</span>
        <h5 className="card-title">{book.title}</h5>
        <p className="text-muted small mb-1">{book.author}</p>
        <p className="small flex-grow-1">{book.description?.slice(0, 90)}...</p>
        <div className="d-flex justify-content-between align-items-center">
          <strong>â‚¹{book.price}</strong>
          <span className="text-warning">â˜… {book.rating || 0}</span>
        </div>
      </div>
      <div className="card-footer bg-white d-flex gap-2">
        <Link className="btn btn-outline-dark btn-sm flex-fill" to={`/books/${book._id}`}>Details</Link>
        <button className="btn btn-warning btn-sm flex-fill" onClick={() => addToCart(book)}>Add</button>
      </div>
    </div>
  );
}

