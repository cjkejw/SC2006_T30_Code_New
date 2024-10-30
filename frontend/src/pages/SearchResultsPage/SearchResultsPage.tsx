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
  const initialFetchDone = useRef(false); // Track if fetch has already been done
  const navigate = useNavigate();
  const resultsPerPage = 25;

  /* const fetchResults = async () => {
    try {
      const filterParams = {
        school: searchTerm,
        zones: filters.zones?.map((zone: any) => zone.value).join(","),
        subjectInterests: filters.subjectInterests
          ?.map((subject: any) => subject.value)
          .join(","),
        ccas: filters.ccas?.map((cca: any) => cca.value).join(","),
      };

      const response = await axios.get("http://localhost:5073/school/find", {
        params: filterParams,
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
  }; */

  const fetchResults = async () => {
    try {
      let apiUrl = "http://localhost:5073/school/find";
      const filterParams: Record<string, any> = {};

      if (searchTerm) {
        filterParams.school = searchTerm;
      }
      if (
        !searchTerm &&
        (filters.educationLevels ||
          filters.zones ||
          filters.subjectInterests ||
          filters.ccas)
      ) {
        apiUrl = "http://localhost:5073/school/filter3";

        if (filters.educationLevels) {
          filterParams.educationLevels = filters.educationLevels
            .map((level: any) => level.value)
            .join(",");
        }
        if (filters.zones) {
          filterParams.zones = filters.zones
            .map((zone: any) => zone.value)
            .join(",");
        }
        if (filters.subjectInterests) {
          filterParams.subjectInterests = filters.subjectInterests
            .map((subject: any) => subject.value)
            .join(",");
        }
        if (filters.ccas) {
          filterParams.ccas = filters.ccas
            .map((cca: any) => cca.value)
            .join(",");
        }
      }

      const cleanedParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value)
      );

      console.log("API URL:", apiUrl);
      console.log("Filter Parameters Sent:", cleanedParams);

      const response = await axios.get(apiUrl, {
        params: cleanedParams,
      });

      const data = response.data;
      console.log("Response Data:", data);
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
      if (axios.isAxiosError(error)) {
        console.error("Axios error fetching search results:", error.message);
        console.error("Error details:", error.response?.data || error.config);
      } else {
        console.error("Unexpected error fetching search results:", error);
      }
    }
  };

  useEffect(() => {
    // Prevent the initial fetch from running multiple times
    if (initialFetchDone.current) {
      console.log("Filters before fetch:", filters);
      fetchResults();
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

const handleFilterChange = useCallback((filterData: any) => {
  console.log("Filters before setting in handleFilterChange:", filterData);
  setFilters(filterData);
  console.log("Filters after setting in handleFilterChange:", filterData);
}, []);


  return (
    <div className="search-results-page">
      <div className="search-results-soley">
        <h2>Search Results for: "{searchTerm}"</h2>
        {results.length > 0 && (
          <p>
            {results.length} result{results.length > 1 ? "s" : ""} found.
          </p>
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
