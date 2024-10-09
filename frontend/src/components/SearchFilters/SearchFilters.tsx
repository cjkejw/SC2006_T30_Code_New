import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import "./SearchFilters.css";

type Option = { value: string; label: string };

interface SearchFiltersProps {
  onFilterChange: (filters: {
    zones: MultiValue<Option>;
    subjectInterests: MultiValue<Option>;
    distinctiveProgrammes: MultiValue<Option>;
    ccas: MultiValue<Option>;
  }) => void;
  onFilterSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange, onFilterSearch }) => {
  const [selectedZones, setSelectedZones] = useState<MultiValue<Option>>([]);
  const [selectedSubjectInterests, setSelectedSubjectInterests] = useState<MultiValue<Option>>([]);
  const [selectedDistinctiveProgrammes, setSelectedDistinctiveProgrammes] = useState<MultiValue<Option>>([]);
  const [selectedCcas, setSelectedCcas] = useState<MultiValue<Option>>([]);

  useEffect(() => {
    const filters = {
      zones: selectedZones,
      subjectInterests: selectedSubjectInterests,
      distinctiveProgrammes: selectedDistinctiveProgrammes,
      ccas: selectedCcas,
    };
    onFilterChange(filters);
  }, [selectedZones, selectedSubjectInterests, selectedDistinctiveProgrammes, selectedCcas, onFilterChange]);

  const handleZoneChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedZones(selectedOptions);
  };

  const handleSubjectChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedSubjectInterests(selectedOptions);
  };

  const handleProgrammesChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedDistinctiveProgrammes(selectedOptions);
  };

  const handleCcaChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedCcas(selectedOptions);
  };

  const handleSearchClick = () => {
    console.log("Selected Zones:", selectedZones);
    console.log("Selected Subject Interests:", selectedSubjectInterests);
    console.log(
      "Selected Distinctive Programmes:",
      selectedDistinctiveProgrammes
    );
    console.log("Selected CCAs:", selectedCcas);
    onFilterSearch();
  };

  const zoneOptions: Option[] = [
    { value: "north", label: "North" },
    { value: "south", label: "South" },
    { value: "east", label: "East" },
    { value: "west", label: "West" },
  ];

  const subjectOptions: Option[] = [
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "literature", label: "Literature" },
    { value: "history", label: "History" },
    { value: "art", label: "Art" },
  ];

  const programmeOptions: Option[] = [
    { value: "lunch", label: "Lunch" },
    { value: "sleep", label: "Sleep" },
    { value: "walk", label: "Walk" },
  ];

  const ccaOptions: Option[] = [
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "arts", label: "Arts" },
    { value: "drama", label: "Drama" },
    { value: "robotics", label: "Robotics" },
  ];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      border: "1px solid #777BE2",
      borderRadius: "8px",
      boxShadow: "none",
      padding: "5px 10px",
      width: "300px",
    }),
    menu: (base: any) => ({
      ...base,
      width: "300px",
      padding: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "110px",
      overflowY: "auto",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      border: "1px solid #777BE2",
      borderRadius: "4px",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#777BE2",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#bbb",
      "&:hover": {
        backgroundColor: "#f0f0ff",
      },
    }),
  };

  return (
    <div className="filters">
      <div className="filter-item">
        <img
          src="/assets/bag-logo.png"
          alt="Education Level"
          className="filter-icon"
        />
        <Select
          styles={customStyles}
          options={[
            { value: "primary", label: "Primary school" },
            { value: "secondary", label: "Secondary school" },
            { value: "junior-college", label: "Junior College" },
          ]}
          placeholder="Education Level"
        />
      </div>

      <div className="filter-item">
        <img
          src="/assets/location-logo.png"
          alt="Zone"
          className="filter-icon"
        />
        <Select
          styles={customStyles}
          isMulti
          options={zoneOptions}
          value={selectedZones}
          onChange={handleZoneChange}
          placeholder="Zone"
        />
      </div>

      <div className="filter-item">
        <img
          src="/assets/document-logo.png"
          alt="Subject Interests"
          className="filter-icon"
        />
        <Select
          styles={customStyles}
          isMulti
          options={subjectOptions}
          value={selectedSubjectInterests}
          onChange={handleSubjectChange}
          placeholder="Subject Interests"
        />
      </div>

      <div className="filter-item">
        <img
          src="/assets/dotdotdot-logo.png"
          alt="Distinctive Programmes"
          className="filter-icon"
        />
        <Select
          styles={customStyles}
          isMulti
          options={programmeOptions}
          value={selectedDistinctiveProgrammes}
          onChange={handleProgrammesChange}
          placeholder="Distinctive Programmes"
        />
      </div>

      <div className="filter-item">
        <img
          src="/assets/star-circle-logo.png"
          alt="Co-Curricular Activities"
          className="filter-icon"
        />
        <Select
          styles={customStyles}
          isMulti
          options={ccaOptions}
          value={selectedCcas}
          onChange={handleCcaChange}
          placeholder="Co-Curricular Activities"
        />
      </div>

      <button className="search-button" onClick={handleSearchClick}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchFilters;
