import { Link, useParams } from "react-router-dom";
import { shortId } from "../utils/format.js";

export default function OrderSuccess() {
  const { id } = useParams();
  return <div className="container section"><div className="success-panel"><span>Success</span><h1>Order placed beautifully.</h1><p>Your order {shortId(id)} has been created. Payment status is marked successful for this demo checkout.</p><div><Link className="btn btn-gold" to="/orders">View Orders</Link><Link className="btn btn-ghost" to="/books">Continue Shopping</Link></div></div></div>;
}

