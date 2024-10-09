import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import './SchoolSearchPage.css';

const SchoolSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    navigate('/search-results', { state: { query: term, filters } });
  };

  const handleFilterSearch = () => {
    navigate('/search-results', { state: { query: searchTerm, filters } });
  };

  const handleFilterChange = useCallback((filterData: any) => {
    setFilters(filterData);
  }, []);

  return (
    <div className="school-search-page">
      <h1>Find Your Desired <span>SCHOOL</span></h1>
      <div className="search-content">
        <SearchBar onSearch={handleSearch} />
        <SearchFilters onFilterChange={handleFilterChange} onFilterSearch={handleFilterSearch} />
      </div>
    </div>
  );
};

export default SchoolSearchPage;
