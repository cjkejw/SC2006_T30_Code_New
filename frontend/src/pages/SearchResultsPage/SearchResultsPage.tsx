import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";
import SearchResultPagination from "../../components/SearchResultPagination/SearchResultPagination";
import "./SearchResultsPage.css";
import { findSchool } from "../../services/apiService";

interface Result {
  schoolName: string;
  schoolType: string;
  website: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || "";
  const filtersFromLocation = location.state?.filters || {};
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [filters, setFilters] = useState(filtersFromLocation);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const resultsPerPage = 2;

  useEffect(() => {
    // Fetch schools from the API when the component loads
    const fetchSchoolDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const schoolDetails = await findSchool(searchTerm, filters);
        // Map the API response to match the Result type
        const mappedResults = schoolDetails.map((school: any) => ({
          schoolName: school.school_name,
          schoolType: school.nature_code,
          website: school.url_address,
        }));
        setResults(mappedResults);
      } catch (error) {
        console.error("Error fetching school details:", error);
        setError("An error occurred while fetching school details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolDetails();
  }, [searchTerm, filters]);

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    navigate("/search-results", { state: { query: term, filters } });
  };

  const handleFilterSearch = async () => {
    navigate('/search-results', { state: { query: searchTerm, filters } });
  };

  const handleFilterChange = useCallback((filterData: any) => {
    setFilters(filterData);
  }, []);

  return (
    <div className="search-results-page">
      <h2>Search Results for: "{searchTerm}"</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : results.length === 0 ? (
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

      {results.length > 0 && (
        <SearchResultPagination
          currentPage={currentPage}
          totalPages={Math.ceil(results.length / resultsPerPage)}
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
