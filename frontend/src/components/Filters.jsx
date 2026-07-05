export default function Filters({ filters, setFilters, meta }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  return (
    <div className="row g-2">
      <div className="col-md-3">
        <select className="form-select" value={filters.genre} onChange={(e) => update("genre", e.target.value)}>
          <option value="">All Genres</option>
          {meta.genres?.map((genre) => <option key={genre}>{genre}</option>)}
        </select>
      </div>
      <div className="col-md-3">
        <select className="form-select" value={filters.author} onChange={(e) => update("author", e.target.value)}>
          <option value="">All Authors</option>
          {meta.authors?.map((author) => <option key={author}>{author}</option>)}
        </select>
      </div>
      <div className="col-md-2"><input className="form-control" placeholder="Max price" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} /></div>
      <div className="col-md-2">
        <select className="form-select" value={filters.rating} onChange={(e) => update("rating", e.target.value)}>
          <option value="">Rating</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
          <option value="2">2+</option>
        </select>
      </div>
      <div className="col-md-2">
        <select className="form-select" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-low">Price Low</option>
          <option value="price-high">Price High</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>
    </div>
  );
}

