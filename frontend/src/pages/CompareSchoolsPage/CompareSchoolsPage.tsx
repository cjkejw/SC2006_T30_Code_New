import React from 'react';
import CompareSchool, { Option } from '../../components/CompareSchool/CompareSchool'
import Select, { MultiValue } from 'react-select';
import './CompareSchoolsPage.css';

const CompareSchoolsPage: React.FC = () => {
  const handleFilterChange = (filters: { School1: MultiValue<Option>; School2: MultiValue<Option>; }) => {
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