import React, { useState, useEffect, useRef } from "react";
import Select, { MultiValue } from "react-select";
import "./SearchFilters.css";
import axios from "axios";

type Option = { value: string; label: string };

interface SearchFiltersProps {
  onFilterChange: (filters: {
    educationLevels: MultiValue<Option>;
    zones: MultiValue<Option>;
    subjectInterests: MultiValue<Option>;
    ccas: MultiValue<Option>;
  }) => void;
  onFilterSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterChange,
  onFilterSearch,
}) => {
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<
    MultiValue<Option>
  >([]);
  const [selectedZones, setSelectedZones] = useState<MultiValue<Option>>([]);
  const [selectedSubjectInterests, setSelectedSubjectInterests] = useState<
    MultiValue<Option>
  >([]);
  const [selectedCcas, setSelectedCcas] = useState<MultiValue<Option>>([]);

  const [educationLevelOptions, setEducationLevelOptions] = useState<Option[]>(
    []
  );
  const [zoneOptions, setZoneOptions] = useState<Option[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [ccaOptions, setCcaOptions] = useState<Option[]>([]);

   // To ensure the data is fetched only once
   const hasFetchedData = useRef(false);

   useEffect(() => {
     if (hasFetchedData.current) {
       return; // If data has already been fetched, don't fetch again
     }
 
     const fetchFilterOptions = async () => {
       try {
         const [educationLevelsResponse, zonesResponse, subjectsResponse, ccasResponse] = await Promise.all([
           axios.get("http://localhost:5073/school/filter", { params: { filterType: "educationLevel" } }),
           axios.get("http://localhost:5073/school/filter", { params: { filterType: "zones" } }),
           axios.get("http://localhost:5073/school/filter", { params: { filterType: "subjects" } }),
           axios.get("http://localhost:5073/school/filter", { params: { filterType: "ccas" } }),
         ]);
 
         setEducationLevelOptions(
           educationLevelsResponse.data.map((educationLevel: any) => ({
             value: educationLevel.mainLevelCode,
             label: educationLevel.mainLevelName,
           }))
         );
 
         setZoneOptions(
           zonesResponse.data.map((zone: any) => ({
             value: zone.zoneCode,
             label: zone.zoneName,
           }))
         );
 
         setSubjectOptions(
           subjectsResponse.data.map((subject: any) => ({
             value: subject.subjectCode,
             label: subject.subjectName,
           }))
         );
 
         setCcaOptions(
           ccasResponse.data.map((cca: any) => ({
             value: cca.ccaCode,
             label: cca.ccaName,
           }))
         );
 
         hasFetchedData.current = true; // Mark data as fetched
       } catch (error) {
         console.error("Error fetching filter options:", error);
       }
     };
 
     fetchFilterOptions();
   }, []);

  useEffect(() => {
    const filters = {
      educationLevels: selectedEducationLevels,
      zones: selectedZones,
      subjectInterests: selectedSubjectInterests,
      ccas: selectedCcas,
    };
    onFilterChange(filters);
  }, [
    selectedEducationLevels,
    selectedZones,
    selectedSubjectInterests,
    selectedCcas,
    onFilterChange,
  ]);

  const handleEducationLevelChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedEducationLevels(selectedOptions);
  };

  const handleZoneChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedZones(selectedOptions);
  };

  const handleSubjectChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedSubjectInterests(selectedOptions);
  };

  const handleCcaChange = (selectedOptions: MultiValue<Option>) => {
    setSelectedCcas(selectedOptions);
  };

  const handleSearchClick = () => {
    console.log("Selected Zones:", selectedZones);
    console.log("Selected Subject Interests:", selectedSubjectInterests);
    console.log("Selected Education Levels:", selectedEducationLevels);
    console.log("Selected CCAs:", selectedCcas);
    onFilterSearch();
  };

  // const zoneOptions: Option[] = [
  //   { value: "north", label: "North" },
  //   { value: "south", label: "South" },
  //   { value: "east", label: "East" },
  //   { value: "west", label: "West" },
  // ];

  // const subjectOptions: Option[] = [
  //   { value: "math", label: "Math" },
  //   { value: "science", label: "Science" },
  //   { value: "literature", label: "Literature" },
  //   { value: "history", label: "History" },
  //   { value: "art", label: "Art" },
  // ];

  // const programmeOptions: Option[] = [
  //   { value: "lunch", label: "Lunch" },
  //   { value: "sleep", label: "Sleep" },
  //   { value: "walk", label: "Walk" },
  // ];

  // const ccaOptions: Option[] = [
  //   { value: "sports", label: "Sports" },
  //   { value: "music", label: "Music" },
  //   { value: "arts", label: "Arts" },
  //   { value: "drama", label: "Drama" },
  //   { value: "robotics", label: "Robotics" },
  // ];

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
          isMulti
          options={educationLevelOptions}
          value={selectedEducationLevels}
          onChange={handleEducationLevelChange}
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
