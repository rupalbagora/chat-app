import { useDebounce } from "../hooks/useDebounce.js";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const debounced = useDebounce(value, 300);

  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value, debounced)}
        placeholder={placeholder}
      />
    </div>
  );
}
