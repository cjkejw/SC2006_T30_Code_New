import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query); // Submit the query when the form is submitted (either on "Enter" or image click)
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Enter School Name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <input
        type="image"
        src="./assets/magnifying-glass-image.png"
        alt="Submit"
        className="search-image"
      />
    </form>
  );
};

export default SearchBar;
