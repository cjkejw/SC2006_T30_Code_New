import React, { useState, useCallback, useEffect, useRef } from "react";
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
  useEffect(() => {
    document.title = "Search results";
  }, []);

  const location = useLocation();
  const query = location.state?.query || ""; // Retrieve the search query from state
  const filtersFromLocation = location.state?.filters || {}; // Retrieve any filters from state

  const [searchTerm, setSearchTerm] = useState(query);
  const [filters, setFilters] = useState(filtersFromLocation);
  const [results, setResults] = useState<Result[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const initialFetchDone = useRef(false); // Track if fetch has already been done
  const navigate = useNavigate();
  const resultsPerPage = 25;

  //code to be used commented out first
  const fetchResults = async () => {
    setLoading(true);
    try {
      let apiUrl = "";
      const filterParams: Record<string, any> = {};

      // Assign search term if it exists
      if (searchTerm) {
        apiUrl = "http://localhost:5073/school/find";
        filterParams.school = searchTerm;
      } else if (
        filters.educationLevel.length > 0 ||
        filters.zone.length > 0 ||
        filters.subjects.length > 0 ||
        filters.cca.length > 0
      ) {
        apiUrl = "http://localhost:5073/school/filter";

        // Add filters only if they have selected values
        if (filters.educationLevel.length > 0) {
          filterParams.educationLevel = filters.educationLevel
            .map((level: Option) => level.value)
            .join(",");
        }
        if (filters.zone.length > 0) {
          filterParams.zone = filters.zone
            .map((zone: Option) => zone.value)
            .join(",");
        }
        if (filters.subjects.length > 0) {
          filterParams.subjects = filters.subjects
            .map((subjects: Option) => subjects.value)
            .join(",");
        }
        if (filters.cca.length > 0) {
          filterParams.cca = filters.cca
            .map((cca: Option) => cca.value)
            .join(",");
        }
      } else {
        console.log("No search term or filters selected, skipping fetch.");
        setLoading(false);
        return; // Skip fetch if no search term or filters are present
      }

      // Clean up and log parameters for validation
      const cleanedParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value)
      );

      console.log("API URL:", apiUrl);
      console.log("Filter Parameters Sent:", cleanedParams);

      const response = await axios.get(apiUrl, { params: cleanedParams });
      const data = response.data;

      console.log("Response Data:", data);

      // Map data to displayable results
      const mappedResults = Object.keys(data).map((schoolName) => ({
        schoolName,
        schoolType: data[schoolName].natureCode,
        website: data[schoolName].urlAddress,
        address: data[schoolName].address,
        zone: data[schoolName].zoneCode,
        telephoneNo: data[schoolName].telephoneNo,
      }));

      setResults(mappedResults);
      setTotalPages(Math.ceil(mappedResults.length / resultsPerPage));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error fetching search results:", error.message);
        console.error("Error details:", error.response?.data || error.config);
      } else {
        console.error("Unexpected error fetching search results:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  //hard code for testing
  // const fetchResults = async () => {
  //   try {
  //     let apiUrl = "http://localhost:5073/school/filter";
  //     const filterParams: Record<string, any> = {
  //       educationLevel: "PRIMARY", // Hardcode for testing
  //     };

  //     console.log("Hardcoded Filter Parameters Sent:", filterParams);

  //     const response = await axios.get(apiUrl, { params: filterParams });
  //     const data = response.data;

  //     console.log("Response Data with Hardcoded Filter:", data);

  //     const mappedResults = Object.keys(data).map((schoolName) => ({
  //       schoolName,
  //       schoolType: data[schoolName].natureCode,
  //       website: data[schoolName].urlAddress,
  //       address: data[schoolName].address,
  //       zone: data[schoolName].zoneCode,
  //       telephoneNo: data[schoolName].telephoneNo,
  //     }));

  //     setResults(mappedResults);
  //     setTotalPages(Math.ceil(mappedResults.length / resultsPerPage));
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error("Axios error fetching search results:", error.message);
  //       console.error("Error details:", error.response?.data || error.config);
  //     } else {
  //       console.error("Unexpected error fetching search results:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    const hasValidFilters =
      filters.educationLevel.length > 0 ||
      filters.zone.length > 0 ||
      filters.subjects.length > 0 ||
      filters.cca.length > 0;

    // Prevent the initial fetch from running multiple times
    if (initialFetchDone.current) {
      console.log("Filters before fetch:", filters);
      if (searchTerm || hasValidFilters) {
        console.log("Filters before fetch:", filters);
        fetchResults();
      } else {
        console.log("No search term or filters selected, skipping fetch.");
      }
    } else {
      initialFetchDone.current = true; // Set to true after the first fetch
    }
  }, [searchTerm, filters]); // Only re-run when `searchTerm` or `filters` changes

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
    fetchResults();
    navigate("/search-results", { state: { query: searchTerm, filters } });
  };

  const handleFilterChange = useCallback(
    (filterData: any) => {
      console.log("Filters before setting in handleFilterChange:", filterData);

      // Check if the new filterData is actually different from the current filters
      if (JSON.stringify(filterData) !== JSON.stringify(filters)) {
        setFilters(filterData);
        console.log("Filters after setting in handleFilterChange:", filterData);
      } else {
        console.log("No change in filters, skipping update.");
      }
    },
    [filters]
  );

  return (
    <div className="search-results-page">
      <div className="search-results-soley">
        <h2>Search Results{searchTerm ? ` for: "${searchTerm}"` : ":"}</h2>
        {loading ? (
          <p>Loading results...</p> // Show loading message
        ) : results.length === 0 ? (
          <p>No results found</p>
        ) : (
          <>
            <p>
              {results.length} result{results.length > 1 ? "s" : ""} found.
            </p>
          {paginatedResults.map((result, index) => (
            <SearchResultItem
              key={index}
              schoolName={result.schoolName}
              schoolType={result.schoolType}
              website={result.website}
            />
          ))}
          </>
        )}
      </div>

      {results.length > 0 && (
        <SearchResultPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {!searchTerm && (
        <SearchFilters
          onFilterChange={handleFilterChange}
          onFilterSearch={handleFilterSearch}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;