import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookCard, BookCardSkeleton, EmptyState, ErrorState, RatingStars } from "../components/UI.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

const categories = [
  ["Fiction", "Stories, classics, and literary escapes"], ["Technology", "Programming, systems, and future skills"], ["Science", "Curious reads for curious minds"], ["Business", "Startups, strategy, and leadership"], ["History", "Past worlds and powerful lessons"], ["Self Help", "Habits, focus, and personal growth"], ["Biography", "Lives that shaped the world"], ["Children", "Bright books for young readers"]
];
const benefits = [["Wide Collection", "Curated books across genres and authors."], ["Secure Shopping", "JWT protected checkout and account access."], ["Fast Ordering", "Simple cart, address, and dummy payment flow."], ["Trusted Reviews", "Authenticated readers can add ratings."]];
const testimonials = ["A polished bookstore demo with real shopping flows.", "The filters and details page make the catalog feel alive.", "Admin controls are easy to explain during review."];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get("/books?limit=8&sort=newest").then(({ data }) => setBooks(data.books || [])).catch(() => setError("Unable to load featured books.")) .finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy"><span className="eyebrow">Premium online bookstore</span><h1>Find your next favorite book in a warmer, smarter store.</h1><p>Browse hand-picked reads, compare ratings, save books to cart, and place orders through a full MERN stack shopping experience.</p><form className="hero-search" onSubmit={(e) => { e.preventDefault(); navigate(`/books?search=${encodeURIComponent(search)}`); }}><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books, authors, genres" /><button>Search</button></form><div className="hero-actions"><Link className="btn btn-gold" to="/books">Explore Books</Link><Link className="btn btn-ghost" to="/books?genre=Fiction">Browse Categories</Link></div></div>
          <div className="book-composition" aria-label="Featured book composition"><div className="stack-card one"><span>Technology</span><strong>Clean Code</strong><RatingStars value={4.7} /></div><div className="stack-card two"><span>Fiction</span><strong>The Alchemist</strong><RatingStars value={4.5} /></div><div className="stack-card three"><span>Self Help</span><strong>Atomic Habits</strong><RatingStars value={4.8} /></div></div>
        </div>
      </section>
      <section className="container section"><div className="section-title"><span>Explore by interest</span><h2>Popular Categories</h2></div><div className="category-grid">{categories.map(([name, text]) => <Link className="category-card" to={`/books?genre=${encodeURIComponent(name)}`} key={name}><span>{name.slice(0, 2)}</span><h3>{name}</h3><p>{text}</p></Link>)}</div></section>
      <section className="container section"><div className="section-title"><span>Curated shelf</span><h2>Featured and Latest Books</h2></div>{error ? <ErrorState message={error} onRetry={load} /> : <div className="book-grid">{loading ? Array.from({ length: 8 }, (_, i) => <BookCardSkeleton key={i} />) : books.length ? books.map((book) => <BookCard key={book._id} book={book} onAdd={addToCart} />) : <EmptyState title="No books yet" text="Seed the database to display featured books." to="/books" actionLabel="Browse Catalog" />}</div>}</section>
      <section className="why-band"><div className="container benefit-grid">{benefits.map(([title, text]) => <article key={title}><span>{title.charAt(0)}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="container section"><div className="section-title"><span>Demo feedback</span><h2>Reader Testimonials</h2></div><div className="testimonial-grid">{testimonials.map((text, i) => <blockquote key={text}>“{text}”<cite>Demo Reader {i + 1}</cite></blockquote>)}</div></section>
      <section className="container newsletter"><div><span>Newsletter demo</span><h2>Get fresh reads in your inbox</h2><p>Frontend-only subscription block for project presentation.</p></div><form onSubmit={(e) => e.preventDefault()}><input type="email" placeholder="reader@example.com" aria-label="Email address" /><button className="btn btn-gold">Subscribe</button></form></section>
    </>
  );
}

