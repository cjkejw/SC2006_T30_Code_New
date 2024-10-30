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
      try {
        const resourceId = "d_688b934f82c1059ed0a6993d2a829089";
        const response = await axios.get(
          `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=10000`
        );

        const uniqueEducationLevels = Array.from(
          new Set(
            response.data.result.records.map(
              (school: any) => school.mainlevel_code
            )
          )
        ).map((levelCode) => {
          const level = response.data.result.records.find(
            (school: any) => school.mainlevel_code === levelCode
          );
          return {
            value: level.mainlevel_code,
            label: level.mainlevel_name || level.mainlevel_code,
          };
        });

        setEducationLevelOptions(uniqueEducationLevels);
      } catch (error) {
        console.error("Error fetching education levels:", error);
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

    const fetchSubjects = async () => {
      const resourceId = "d_f1d144e423570c9d84dbc5102c2e664d";
      const limit = 10000;
      const offset = 0;
      const fields = "SUBJECT_DESC";

      const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${limit}&offset=${offset}&fields=${fields}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const uniqueSubjects = Array.from(
          new Set(data.result.records.map((school: any) => school.SUBJECT_DESC))
        ).map((subject) => {
          const subjects = data.result.records.find(
            (school: any) => school.SUBJECT_DESC === subject
          );
          return {
            value: subjects.SUBJECT_DESC,
            label: subjects.SUBJECT_DESC,
          };
        });

        setSubjectOptions(uniqueSubjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchCcas = async () => {
      const resourceId = "d_9aba12b5527843afb0b2e8e4ed6ac6bd";
      const limit = 10000;
      const offset = 0;
      const fields = "cca_generic_name";

      const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${limit}&offset=${offset}&fields=${fields}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        const uniqueCcas = Array.from(
          new Set(
            data.result.records.map((school: any) => school.cca_generic_name)
          )
        ).map((genericCca) => {
          const ccas = data.result.records.find(
            (school: any) => school.cca_generic_name === genericCca
          );
          return {
            value: ccas.cca_generic_name,
            label: ccas.cca_generic_name,
          };
        });

        setCcaOptions(uniqueCcas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

   /*  const fetchFilterOptions = async () => {
      try {
        const [
          subjectsResponse,
          // ccasResponse,
        ] = await Promise.all([
          axios.get("http://localhost:5073/school/filter3", {
            params: { filterType: "subjects" },
          }),
          // axios.get("http://localhost:5073/school/filter3", {
          //   params: { filterType: "ccas" },
          // }),
        ]);

        console.log("Subjects Response:", subjectsResponse);
        // console.log("CCAs Response:", ccasResponse);

        const transformData = (data: any, type: string) => {
          if (typeof data === "object" && !Array.isArray(data)) {
            return Object.entries(data).map(([key, value]: [string, any]) => {
              switch (type) {
                case "subjects":
                  return {
                    value: value.subjectCode,
                    label: value.subjectName,
                  };
                // case "ccas":
                //   return {
                //     value: value.ccaCode,
                //     label: value.ccaName,
                //   };
                default:
                  return { value: key, label: key }; // Fallback if type doesn't match
              }
            });
          }
          return [];
        };

        const subjectsData = transformData(subjectsResponse.data, "subjects");
        // const ccasData = transformData(ccasResponse.data, "ccas");

        setSubjectOptions(subjectsData);
        // setCcaOptions(ccasData);

        hasFetchedData.current = true;
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }; */

    hasFetchedData.current = true;

    Promise.all([
      fetchEducationLevels(),
      fetchZones(),
      fetchSubjects(),
      fetchCcas(),
    ]).catch((error) => {
      console.error("Error fetching data:", error);
    });
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
