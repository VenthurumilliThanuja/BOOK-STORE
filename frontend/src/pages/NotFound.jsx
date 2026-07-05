import { Link } from "react-router-dom";
export default function NotFound() { return <div className="container section"><div className="empty-state"><div className="empty-icon">404</div><h1>Page not found</h1><p>The shelf you are looking for does not exist.</p><Link className="btn btn-gold" to="/">Back Home</Link></div></div>; }

