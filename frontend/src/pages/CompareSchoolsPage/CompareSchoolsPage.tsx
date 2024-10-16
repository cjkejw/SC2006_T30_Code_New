import React from 'react';
import CompareSchool, { Option } from '../../components/CompareSchool/CompareSchool'
import './CompareSchoolsPage.css';

const CompareSchoolsPage: React.FC = () => {
  const handleFilterChange = (filters: { School1: Option | null; School2: Option | null; }) => {
    // Handle filter change logic here
    console.log('Filters changed:', filters);
  };

  const handleFilterSearch = () => {
    // Implement the search logic here
    console.log('Searching for comparisons...');
  };

  return (
    <div className="compareschool-wrapper">
      <CompareSchool onFilterChange={handleFilterChange} onFilterSearch={handleFilterSearch} />
    </div>
  );
};

export default CompareSchoolsPage;