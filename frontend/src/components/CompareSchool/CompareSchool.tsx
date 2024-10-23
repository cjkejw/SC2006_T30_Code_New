import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import './CompareSchool.css';
import axios from 'axios';

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
  const navigate = useNavigate();

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

  const handleSearchClick = async () => {
    console.log("Selected School 1:", selectedSchool1);
    console.log("Selected School 2:", selectedSchool2);
    onFilterSearch();
  
    try {
      if (!selectedSchool1 || !selectedSchool2) {
        console.error('Both schools must be selected.');
        return;
      }

      const response = await axios.get('http://localhost:5073/school/compare', {
        params: {
          school1: selectedSchool1.label,
          school2: selectedSchool2.label
        }
      });
  
      // Log the entire response to see its structure
      console.log('Response Data:', response.data);
  
      // Access school details using the school names as keys
      const school1Details = response.data[selectedSchool1.label];
      const school2Details = response.data[selectedSchool2.label];
  
      // Log the details for debugging
      console.log('School 1 Details:', school1Details);
      console.log('School 2 Details:', school2Details);
  
      // Check if details exist before trying to access them
      if (!school1Details || !school2Details) {
        console.error('One of the schools does not have details');
        return;
      }
  
      // Construct the data objects
      const school1Data = {
        name: selectedSchool1?.label || 'Unknown School 1',
        zone: school1Details.zone || 'Unknown Zone',
        location: school1Details.location || 'Unknown Location',
        subjects: school1Details.subjects || [],
        distinctProgrammes: school1Details.programmes || [],
        cca: school1Details.cca || []
      };
  
      const school2Data = {
        name: selectedSchool2?.label || 'Unknown School 2',
        zone: school2Details.zone || 'Unknown Zone',
        location: school2Details.location || 'Unknown Location',
        subjects: school2Details.subjects || [],
        distinctProgrammes: school2Details.programmes || [],
        cca: school2Details.cca || []
      };
  
      // Navigate to comparison results page with school data
      navigate(`/comparison-results`, {
        state: { school1: school1Data, school2: school2Data },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          console.error('Cannot retrieve');
        } else {
          console.error('There was an error during retrieving:', error);
        }
      }
    }
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
