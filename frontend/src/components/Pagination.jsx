export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="d-flex justify-content-center gap-2 my-4">
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <button key={number} className={`btn btn-sm ${page === number ? "btn-dark" : "btn-outline-dark"}`} onClick={() => onChange(number)}>
          {number}
        </button>
      ))}
    </div>
  );
}

