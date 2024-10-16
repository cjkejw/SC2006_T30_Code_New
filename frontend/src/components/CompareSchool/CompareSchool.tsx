import React, { useState, useEffect } from "react";
import Select from "react-select";
import './CompareSchool.css';

export type Option = { value: string; label: string }; // Export the Option type

interface SearchFiltersProps {
  onFilterChange: (filters: {
    School1: Option | null;
    School2: Option | null;
  }) => void;
  onFilterSearch: () => void;
}

const CompareSchool: React.FC<SearchFiltersProps> = ({ onFilterChange, onFilterSearch }) => {
  const [selectedSchool1, setSelectedSchool1] = useState<Option | null>(null);
  const [selectedSchool2, setSelectedSchool2] = useState<Option | null>(null);
  const [schoolOptions, setSchoolOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchSchools = async () => {
      const resourceId = "d_688b934f82c1059ed0a6993d2a829089";
      const limit = 10000;
      const offset = 0;
      const fields = "school_name, postal_code";

      const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${limit}&offset=${offset}&fields=${fields}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        const schools = data.result.records.map((school: any) => ({
          value: school.postal_code,
          label: school.school_name,
        }));
        setSchoolOptions(schools);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const filters = {
      School1: selectedSchool1,
      School2: selectedSchool2,
    };
    onFilterChange(filters);
  }, [selectedSchool1, selectedSchool2]);

  const handleSchool1Change = (selectedOptions: Option | null) => {
    setSelectedSchool1(selectedOptions);
  };
  
  const handleSchool2Change = (selectedOptions: Option | null) => {
    setSelectedSchool2(selectedOptions);
  };

  const handleSearchClick = () => {
    console.log("Selected School 1:", selectedSchool1);
    console.log("Selected School 2:", selectedSchool2);
    onFilterSearch();
  };

  const filteredSchool1Options = schoolOptions.filter(
    (school) => selectedSchool2 === null || selectedSchool2.value !== school.value
  );

  const filteredSchool2Options = schoolOptions.filter(
    (school) => selectedSchool1 === null || selectedSchool1.value !== school.value
  );

  const customStyles = {
    placeholder: (provided: any) => ({
      ...provided,
      color: '#CAD1E1', // Custom placeholder font color
    }),
  };

  return (
    <>
      <div className="header-font">
        Undecided?<br />Compare <span style={{ color: '#777BE2' }}>Schools</span>
      </div>
      <div className="dropdown-wrapper">
        <Select 
          className="dropdown-individual"
          options={filteredSchool1Options}
          value={selectedSchool1}
          onChange={handleSchool1Change}
          placeholder="Select School"
          styles={customStyles}
        />
        <Select 
          className="dropdown-individual"
          options={filteredSchool2Options} // Use filtered options
          value={selectedSchool2}
          onChange={handleSchool2Change}
          placeholder="Select School"
          styles={customStyles}
        />
      </div>
      <button type="submit" onClick={handleSearchClick}>COMPARE</button>
    </>
  );
};

export default CompareSchool;
