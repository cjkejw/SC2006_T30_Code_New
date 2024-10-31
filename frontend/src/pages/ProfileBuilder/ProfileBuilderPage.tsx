import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useProfileOptions } from "./useProfileOptions";
import "./ProfileBuilderPage.css";

const ProfileBuilderPage: React.FC = () => {
  const { educationLevelOptions, zoneOptions, subjectsOptions, ccaOptions } = useProfileOptions();

  const [selectedEducationLevel, setSelectedEducationLevel] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCca, setSelectedCca] = useState(null);

  useEffect(() => {
    document.title = "Profile Builder";
  }, []);

  const handleEducationChange = (selectedOption: any) => {
    setSelectedEducationLevel(selectedOption);
  };

  const handleZoneChange = (selectedOption: any) => {
    setSelectedZone(selectedOption);
  };

  const handleSubjectChange = (selectedOption: any) => {
    setSelectedSubject(selectedOption);
  };

  const handleCcaChange = (selectedOption: any) => {
    setSelectedCca(selectedOption);
  };

  return (
    <div className="profile-builder-page">
      <h2>User Profile</h2>
      <div className="form-group">
        <label>Education Level</label>
        <Select
          options={educationLevelOptions}
          value={selectedEducationLevel}
          onChange={handleEducationChange}
          placeholder="Select Education Level"
        />
      </div>
      <div className="form-group">
        <label>Zone</label>
        <Select
          options={zoneOptions}
          value={selectedZone}
          onChange={handleZoneChange}
          placeholder="Select Zone"
        />
      </div>
      <div className="form-group">
        <label>Subjects</label>
        <Select
          options={subjectsOptions}
          value={selectedSubject}
          onChange={handleSubjectChange}
          placeholder="Select Subject"
        />
      </div>
      <div className="form-group">
        <label>Co-Curricular Activities (CCA)</label>
        <Select
          options={ccaOptions}
          value={selectedCca}
          onChange={handleCcaChange}
          placeholder="Select CCA"
        />
      </div>
      <button className="save-button">SAVE</button>
    </div>
  );
};

export default ProfileBuilderPage;
