import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertMessage, BookCard, Breadcrumbs, EmptyState, ErrorState, LoadingSpinner, QuantitySelector, RatingStars } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";
import { bookImage, money } from "../utils/format.js";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [bookRes, reviewRes] = await Promise.all([api.get(`/books/${id}`), api.get(`/reviews/${id}`)]);
      setBook(bookRes.data); setReviews(reviewRes.data || []);
      const rel = await api.get("/books", { params: { genre: bookRes.data.genre, limit: 4 } });
      setRelated((rel.data.books || []).filter((b) => b._id !== id));
    } catch (err) { setError(err.response?.data?.message || "Unable to load book."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const submitReview = async (e) => { e.preventDefault(); try { await api.post("/reviews", { ...review, book: id }); setReview({ rating: 5, comment: "" }); setMessage("Review submitted successfully."); load(); } catch (err) { setError(err.response?.data?.message || "Could not submit review."); } };
  const buyNow = () => { addToCart(book, qty); navigate("/checkout"); };

  if (loading) return <LoadingSpinner />;
  if (error && !book) return <div className="container section"><ErrorState message={error} onRetry={load} /></div>;

  return <div className="container section"><Breadcrumbs items={[{ label: "Books", to: "/books" }, { label: book.title }]} /><AlertMessage type="success">{message}</AlertMessage><AlertMessage>{error}</AlertMessage><section className="detail-grid"><div className="detail-cover"><img src={bookImage(book.image)} alt={`${book.title} cover`} /></div><div className="detail-info"><span className="genre-pill">{book.genre}</span><h1>{book.title}</h1><p className="author">by {book.author}</p><RatingStars value={book.rating || 0} count={reviews.length} /><p className="detail-price">{money(book.price)}</p><p>{book.description}</p><div className="info-list"><div><span>Stock</span><strong className={book.stock > 0 ? "in-stock" : "out-stock"}>{book.stock > 0 ? `${book.stock} available` : "Out of stock"}</strong></div><div><span>Payment</span><strong>Dummy secure payment</strong></div><div><span>Delivery</span><strong>Fast order processing</strong></div></div><QuantitySelector value={qty} max={book.stock || 1} onChange={setQty} /><div className="detail-actions"><button className="btn btn-gold" disabled={book.stock === 0} onClick={() => addToCart(book, qty)}>Add to Cart</button><button className="btn btn-ink" disabled={book.stock === 0} onClick={buyNow}>Buy Now</button></div></div></section><section className="section two-column"><div><h2>Customer Reviews</h2>{reviews.length ? reviews.map((item) => <article className="review-card" key={item._id}><RatingStars value={item.rating} /><strong>{item.user?.name || "Reader"}</strong><p>{item.comment}</p></article>) : <EmptyState title="No reviews yet" text="Be the first authenticated reader to review this book." />}</div><div className="review-form"><h2>Write a Review</h2>{user ? <form onSubmit={submitReview}><label>Rating<select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>{[5,4,3,2,1].map((r) => <option key={r}>{r}</option>)}</select></label><label>Comment<textarea rows="5" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required /></label><button className="btn btn-gold">Submit Review</button></form> : <p><Link to="/login">Login</Link> to submit your review.</p>}</div></section><section className="section"><div className="section-title"><span>Similar shelf</span><h2>Related Books</h2></div><div className="book-grid">{related.map((item) => <BookCard key={item._id} book={item} onAdd={addToCart} />)}</div></section></div>;
}

