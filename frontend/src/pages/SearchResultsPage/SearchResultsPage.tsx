import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";
import SearchResultPagination from "../../components/SearchResultPagination/SearchResultPagination";
import "./SearchResultsPage.css";
import { findSchool } from "../../services/apiService";

interface Result {
  schoolName: string;
  address: string;
  zoneCode: string;
  telephoneNo: string;
  natureCode: string;
  email: string;
  urlAddress: string;
}

interface FilterData {
  [key: string]: any;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = location.state?.query || "";
  const filtersFromLocation = location.state?.filters || {};

  const [searchTerm, setSearchTerm] = useState<string>(query);
  const [filters, setFilters] = useState<FilterData>(filtersFromLocation);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
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
        const mappedResults: Result[] = Object.keys(schoolDetails).map((schoolName) => ({
          schoolName,
          address: schoolDetails[schoolName].address,
          zoneCode: schoolDetails[schoolName].zoneCode,
          telephoneNo: schoolDetails[schoolName].telephoneNo,
          natureCode: schoolDetails[schoolName].natureCode,
          email: schoolDetails[schoolName].email,
          urlAddress: schoolDetails[schoolName].urlAddress,
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

  const handleFilterSearch = () => {
    navigate('/search-results', { state: { query: searchTerm, filters } });
  };

  const handleFilterChange = useCallback((filterData: FilterData) => {
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
            schoolType={result.natureCode}
            website={result.urlAddress}
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
