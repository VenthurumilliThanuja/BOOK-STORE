export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="form-control"
      placeholder="Search by title, author, or genre"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

