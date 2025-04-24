import { FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (query: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearch,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto mb-8">
      <input
        type="text"
        placeholder="Search for artist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Search
      </button>
    </form>
  );
}
