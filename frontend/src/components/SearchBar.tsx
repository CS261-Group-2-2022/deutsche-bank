type SearchBarProps = {
  searchText: string;
  onChange: (text: string) => unknown;
};

export default function SearchBar({ searchText, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      {/* <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <SearchIcon className="w-5 h-5" />
        </span> */}
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
