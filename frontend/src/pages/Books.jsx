import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookCard, BookCardSkeleton, Breadcrumbs, EmptyState, ErrorState, PageHeader } from "../components/UI.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../services/api.js";

const initial = { search: "", genre: "", author: "", minPrice: "", maxPrice: "", rating: "", availability: "", sort: "newest", page: "1", view: "grid" };

export default function Books() {
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState({ genres: [], authors: [] });
  const [data, setData] = useState({ books: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  const filters = useMemo(() => ({ ...initial, ...Object.fromEntries(params.entries()) }), [params]);
  const setFilter = (key, value) => setParams({ ...filters, [key]: value, page: "1" });
  const clear = () => setParams({ sort: "newest", page: "1", view: filters.view });

  const load = () => {
    setLoading(true); setError("");
    const query = { ...filters, limit: 8 };
    if (filters.availability === "in") query.minStock = 1;
    api.get("/books", { params: query }).then(({ data }) => {
      const books = filters.availability === "in" ? data.books.filter((b) => b.stock > 0) : data.books;
      setData({ ...data, books });
    }).catch((err) => setError(err.response?.data?.message || "Could not load books.")) .finally(() => setLoading(false));
  };

  useEffect(() => { api.get("/books/meta").then(({ data }) => setMeta(data)).catch(() => {}); }, []);
  useEffect(load, [params]);

  const active = Object.entries(filters).filter(([k, v]) => v && !["page", "sort", "view"].includes(k));
  const filterPanel = <div className="filter-card"><h2>Filters</h2><label>Genre<select value={filters.genre} onChange={(e) => setFilter("genre", e.target.value)}><option value="">All genres</option>{meta.genres.map((g) => <option key={g}>{g}</option>)}</select></label><label>Author<select value={filters.author} onChange={(e) => setFilter("author", e.target.value)}><option value="">All authors</option>{meta.authors.map((a) => <option key={a}>{a}</option>)}</select></label><label>Minimum Price<input value={filters.minPrice} onChange={(e) => setFilter("minPrice", e.target.value)} type="number" min="0" /></label><label>Maximum Price<input value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} type="number" min="0" /></label><label>Rating<select value={filters.rating} onChange={(e) => setFilter("rating", e.target.value)}><option value="">Any rating</option><option value="4">4 stars and up</option><option value="3">3 stars and up</option></select></label><label>Availability<select value={filters.availability} onChange={(e) => setFilter("availability", e.target.value)}><option value="">All</option><option value="in">In stock</option></select></label><button className="btn btn-ghost w-100" onClick={clear}>Clear Filters</button></div>;

  return <div className="container section"><Breadcrumbs items={[{ label: "Books" }]} /><PageHeader eyebrow="Catalog" title="Browse Books" subtitle="Search, filter, sort, and discover books connected to the live backend." /> <div className="catalog-toolbar"><input value={filters.search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search title, author, genre" /><select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)}><option value="newest">Newest</option><option value="price-low">Price Low to High</option><option value="price-high">Price High to Low</option><option value="popularity">Popularity</option></select><div className="view-toggle"><button className={filters.view === "grid" ? "active" : ""} onClick={() => setFilter("view", "grid")}>Grid</button><button className={filters.view === "list" ? "active" : ""} onClick={() => setFilter("view", "list")}>List</button></div><button className="btn btn-ink d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#filterDrawer">Filters</button></div><div className="active-filters">{active.map(([k, v]) => <button key={k} onClick={() => setFilter(k, "")}>{k}: {v} x</button>)}</div><div className="catalog-layout"><aside className="d-none d-lg-block">{filterPanel}</aside><section><div className="result-line"><strong>{data.total} results</strong><span>Page {data.page} of {data.pages}</span></div>{error ? <ErrorState message={error} onRetry={load} /> : loading ? <div className="book-grid">{Array.from({ length: 8 }, (_, i) => <BookCardSkeleton key={i} />)}</div> : data.books.length ? <div className={filters.view === "list" ? "book-list" : "book-grid"}>{data.books.map((book) => <BookCard key={book._id} book={book} onAdd={addToCart} />)}</div> : <EmptyState title="No matching books" text="Try clearing filters or changing your search." to="/books" actionLabel="Reset Catalog" />}<div className="pagination-row">{Array.from({ length: data.pages }, (_, i) => <button key={i + 1} className={Number(filters.page) === i + 1 ? "active" : ""} onClick={() => setParams({ ...filters, page: String(i + 1) })}>{i + 1}</button>)}</div></section></div><div className="offcanvas offcanvas-start" id="filterDrawer"><div className="offcanvas-header"><h5>Filters</h5><button className="btn-close" data-bs-dismiss="offcanvas" /></div><div className="offcanvas-body">{filterPanel}</div></div></div>;
}

