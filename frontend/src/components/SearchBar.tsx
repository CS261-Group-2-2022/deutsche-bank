type SearchBarProps = {
  searchText: string;
  onChange: (text: string) => unknown;
};

export default function SearchBar({ searchText, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <input
        type="search"
        className="w-full border p-2 rounded-lg border-gray-400 bg-gray-50 appearance-none focus:outline-none focus:ring-blue-500"
        placeholder="Search"
        value={searchText}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
