import React, { useState, useCallback } from "react";
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

  useEffect(() => {
    // Fetch schools from the API when the component loads
    const fetchSchoolDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const schoolDetails = await findSchool(searchTerm, filters);
        // Map the API response to match the Result type
        const mappedResults: Result[] = schoolDetails.map((school: any) => ({
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

   // Handle search function to call backend API
   const handleSearch = async (term: string) => {
    setSearchTerm(term);
    try {
      // Call the backend API
      const schoolDetails = await findSchool(term, filters);
      // Navigate to the search results page with the response data
      navigate("/search-results", { state: { query: term, filters, schoolDetails } });
    } catch (error) {
      console.error("Error while searching for school:", error);
      // Handle error appropriately (e.g., show a message to the user)
    }
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