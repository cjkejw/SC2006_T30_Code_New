import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchFilters from "../../components/SearchFilters/SearchFilters";
import "./SchoolSearchPage.css";

const SchoolSearchPage: React.FC = () => {
  useEffect(() => {
    document.title = "School Search";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    navigate("/search-results", { state: { query: term, filters } });
  };

  const handleFilterSearch = () => {
    navigate("/search-results", { state: { query: searchTerm, filters } });
  };

  const handleFilterChange = useCallback((filterData: any) => {
    setFilters(filterData);
  }, []);

  return (
    <div className="school-search-page">
      <div className="school-search-wrapper">
        <h1 className="school-text">
          Find Your Desired<br></br><span className="school-bold">SCHOOL</span>
        </h1>
        <div className="search-bar">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="search-filters">
        <SearchFilters
          onFilterChange={handleFilterChange}
          onFilterSearch={handleFilterSearch}
        />
      </div>
    </div>
  );
};

export default SchoolSearchPage;
