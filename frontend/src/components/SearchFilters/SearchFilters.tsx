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

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }

    const fetchEducationLevels = async () => {
      const resourceId_lvl = "d_688b934f82c1059ed0a6993d2a829089";
      const limit_lvl = 10000;
      const offset_lvl = 0;
      const fields_lvl = "mainlevel_code";

      const url_lvl = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId_lvl}&limit=${limit_lvl}&offset=${offset_lvl}&fields=${fields_lvl}`;

      try {
        const response_lvl = await fetch(url_lvl);
        if (!response_lvl.ok) {
          throw new Error("Failed to fetch data");
        }
        const data_lvl = await response_lvl.json();

        const uniqueEducationLevels = Array.from(
          new Set(data_lvl.result.records.map((school: any) => school.mainlevel_code))
        ).map((zoneCode) => {
          const level = data_lvl.result.records.find(
            (school: any) => school.zone_code === zoneCode
          );
          return {
            value: level.mainlevel_code,
            label: level.mainlevel_name || level.mainlevel_code,
          };
        });

        setEducationLevelOptions(uniqueEducationLevels);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchZones = async () => {
      const resourceId = "d_688b934f82c1059ed0a6993d2a829089";
      const limit = 10000;
      const offset = 0;
      const fields = "zone_code";

      const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${limit}&offset=${offset}&fields=${fields}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const uniqueZones = Array.from(
          new Set(data.result.records.map((school: any) => school.zone_code))
        ).map((zoneCode) => {
          const zone = data.result.records.find(
            (school: any) => school.zone_code === zoneCode
          );
          return {
            value: zone.zone_code,
            label: zone.zone_name || zone.zone_code, // Use zone_name if available, else fallback to zone_code
          };
        });

        setZoneOptions(uniqueZones);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const [
          // educationLevelsResponse,
          // zonesResponse,
          subjectsResponse,
          ccasResponse,
        ] = await Promise.all([
          // axios.get("http://localhost:5073/school/filter3", {
          //   params: { filterType: "educationLevel" },
          // }),
          // axios.get("http://localhost:5073/school/filter3", {
          //   params: { filterType: "zones" },
          // }),
          axios.get("http://localhost:5073/school/filter3", {
            params: { filterType: "subjects" },
          }),
          axios.get("http://localhost:5073/school/filter3", {
            params: { filterType: "ccas" },
          }),
        ]);

        // console.log("Education Levels Response:", educationLevelsResponse);
        // console.log("Zones Response:", zonesResponse);
        console.log("Subjects Response:", subjectsResponse);
        console.log("CCAs Response:", ccasResponse);

        const transformData = (data: any, type: string) => {
          if (typeof data === "object" && !Array.isArray(data)) {
            return Object.entries(data).map(([key, value]: [string, any]) => {
              switch (type) {
                // case "educationLevel":
                //   return {
                //     value: value.mainLevelCode,
                //     label: value.mainLevelName,
                //   };
                // case "zones":
                //   return {
                //     value: value.zoneCode,
                //     label: value.zoneName,
                //   };
                case "subjects":
                  return {
                    value: value.subjectCode,
                    label: value.subjectName,
                  };
                case "ccas":
                  return {
                    value: value.ccaCode,
                    label: value.ccaName,
                  };
                default:
                  return { value: key, label: key }; // Fallback if type doesn't match
              }
            });
          }
          return [];
        };

        // const educationLevelsData = transformData(
        //   educationLevelsResponse.data,
        //   "educationLevel"
        // );
        // const zonesData = transformData(zonesResponse.data, "zones");
        const subjectsData = transformData(subjectsResponse.data, "subjects");
        const ccasData = transformData(ccasResponse.data, "ccas");

        // Set options
        // setEducationLevelOptions(educationLevelsData);
        // setZoneOptions(zonesData);
        setSubjectOptions(subjectsData);
        setCcaOptions(ccasData);

        hasFetchedData.current = true; // Mark data as fetched
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchEducationLevels();
    fetchZones();
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
      color: "#777BE7",
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
