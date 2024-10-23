import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";
import SearchResultPagination from "../../components/SearchResultPagination/SearchResultPagination";
import "./SearchResultsPage.css";

interface Result {
  schoolName: string;
  schoolType: string;
  website: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || ""; // Retrieve the search query from state
  const filtersFromLocation = location.state?.filters || {}; // Retrieve any filters from state
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [filters, setFilters] = useState(filtersFromLocation);
  
  const navigate = useNavigate();

  const allResults: Result[] = [
    {
      schoolName: "Nanyang Technological Primary School",
      schoolType: "Primary School",
      website: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      schoolName: "Nanyang Primary School",
      schoolType: "Primary School",
      website: "http://nanyang.edu.sg",
    },
    {
      schoolName: "Anderson Girls School",
      schoolType: "Secondary School",
      website: "https://www.youtube.com/watch?v=Tn6-PIqc4UM&t=70s",
    },
    {
      schoolName: "Marymount Institution",
      schoolType: "Junior College",
      website: "https://www.youtube.com/watch?v=Tn6-PIqc4UM&t=70s",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 2;

  // Filter the results based on search term and filters (basic filtering for demo purposes)
  const filteredResults = allResults.filter((result) =>
    result.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
    <div className="search-results-page">
      <h2>Search Results for: "{searchTerm}"</h2>
      {filteredResults.length === 0 ? (
        <p>No results found</p>
      ) : (
        paginatedResults.map((result, index) => (
          <SearchResultItem
            key={index}
            schoolName={result.schoolName}
            schoolType={result.schoolType}
            website={result.website}
          />
        ))
      )}

      {filteredResults.length > 0 && (
        <SearchResultPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredResults.length / resultsPerPage)}
          onPageChange={handlePageChange}
        />
      )}

      <SearchFilters
        onFilterChange={handleFilterChange}
        onFilterSearch={handleFilterSearch}
      />
    </div>
  );
};

export default SearchResultsPage;