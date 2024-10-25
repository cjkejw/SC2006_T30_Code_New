import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilters from "../../components/SearchFilters/SearchFilters";
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";
import SearchResultPagination from "../../components/SearchResultPagination/SearchResultPagination";
import "./SearchResultsPage.css";
import axios from "axios";

interface Result {
  schoolName: string;
  schoolType: string;
  website: string;
  address: string;
  zone: string;
  telephoneNo: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || ""; // Retrieve the search query from state
  const filtersFromLocation = location.state?.filters || {}; // Retrieve any filters from state

  const [searchTerm, setSearchTerm] = useState(query);
  const [filters, setFilters] = useState(filtersFromLocation);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const resultsPerPage = 25;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5073/school/find", {
          params: { school: searchTerm },
        });

        const data = response.data;
        const mappedResults = Object.keys(data).map((schoolName) => ({
          schoolName: schoolName,
          schoolType: data[schoolName].natureCode,
          website: data[schoolName].urlAddress,
          address: data[schoolName].address,
          zone: data[schoolName].zoneCode,
          telephoneNo: data[schoolName].telephoneNo,
        }));

        setResults(mappedResults);
        setTotalPages(Math.ceil(mappedResults.length / resultsPerPage));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm, filters]);

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
    <div className="search-results-page">
      <div className="search-results-soley">
        <h2>Search Results for: "{searchTerm}"</h2>
        {results.length > 0 && (
          <p>{results.length} result{results.length > 1 ? 's' : ''} found.</p>
        )}
        {results.length === 0 ? (
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
      </div>

      {results.length > 0 && (
        <SearchResultPagination
          currentPage={currentPage}
          totalPages={totalPages}
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
