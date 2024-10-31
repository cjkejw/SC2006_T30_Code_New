import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { useProfileOptions } from "./useProfileOptions";
import axios from "axios";
import "./ProfileBuilderPage.css";

interface Option {
  value: string;
  label: string;
}

// Utility function to convert a string to Pascal Case
const toPascalCase = (str: string) => {
  return str.replace(/\w+/g, 
    (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
  );
};

const ProfileBuilderPage: React.FC = () => {
  const { educationLevelOptions, zoneOptions, subjectsOptions, ccaOptions } = useProfileOptions();

  const [selectedEducationLevel, setSelectedEducationLevel] = useState<Option | null>(null);
  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Option | null>(null);
  const [selectedCca, setSelectedCca] = useState<Option | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);

  // Convert options to Pascal Case
  const pascalEducationOptions = educationLevelOptions.map(option => ({
    ...option,
    label: toPascalCase(option.label)
  }));
  
  const pascalZoneOptions = zoneOptions.map(option => ({
    ...option,
    label: toPascalCase(option.label)
  }));
  
  const pascalSubjectsOptions = subjectsOptions.map(option => ({
    ...option,
    label: toPascalCase(option.label)
  }));
  
  const pascalCcaOptions = ccaOptions.map(option => ({
    ...option,
    label: toPascalCase(option.label)
  }));

  useEffect(() => {
    document.title = "Profile Builder";
  
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5073/profile/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const profile = response.data;
        console.log("Fetched profile data:", profile); // Debugging output
  
        // Ensure profileId is set if it exists in the response
        setProfileId(profile.ProfileId || profile.profileId);
  
        setSelectedEducationLevel(
          pascalEducationOptions.find(option => option.value === profile.educationLevel) || null
        );
        setSelectedZone(
          pascalZoneOptions.find(option => option.value === profile.location) || null
        );
        setSelectedSubject(
          pascalSubjectsOptions.find(option => option.value === profile.subjectInterests) || null
        );
        setSelectedCca(
          pascalCcaOptions.find(option => option.value === profile.cca) || null
        );
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
  
    fetchUserProfile();
  }, [pascalEducationOptions, pascalZoneOptions, pascalSubjectsOptions, pascalCcaOptions]);

  const handleEducationChange = (selectedOption: SingleValue<Option>) => {
    setSelectedEducationLevel(selectedOption || null);
  };

  const handleZoneChange = (selectedOption: SingleValue<Option>) => {
    setSelectedZone(selectedOption || null);
  };

  const handleSubjectChange = (selectedOption: SingleValue<Option>) => {
    setSelectedSubject(selectedOption || null);
  };

  const handleCcaChange = (selectedOption: SingleValue<Option>) => {
    setSelectedCca(selectedOption || null);
  };

  const handleSave = async () => {
    if (profileId === null) {
      console.warn("Profile ID is null; save action aborted.");
      return;
    }

    // Data object matching UpdateUserProfileRequestDTO in the backend
    const updateData = {
      educationLevel: selectedEducationLevel?.value || "Not Specified",
      location: selectedZone?.value || "Not Specified",
      subjectInterests: selectedSubject?.value || "Not Specified",
      cca: selectedCca?.value || "Not Specified",
    };

    try {
      console.log("Updating profile with ID:", profileId);
      const response = await axios.put(`http://localhost:5073/profile/${profileId}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("Profile updated successfully:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-builder-page">
      <h2>User Profile</h2>
      <div className="form-group">
        <label>Education Level</label>
        <Select
          options={pascalEducationOptions}
          value={selectedEducationLevel}
          onChange={handleEducationChange}
          placeholder="Select Education Level"
        />
      </div>
      <div className="form-group">
        <label>Zone</label>
        <Select
          options={pascalZoneOptions}
          value={selectedZone}
          onChange={handleZoneChange}
          placeholder="Select Zone"
        />
      </div>
      <div className="form-group">
        <label>Subjects</label>
        <Select
          options={pascalSubjectsOptions}
          value={selectedSubject}
          onChange={handleSubjectChange}
          placeholder="Select Subject"
        />
      </div>
      <div className="form-group">
        <label>Co-Curricular Activities (CCA)</label>
        <Select
          options={pascalCcaOptions}
          value={selectedCca}
          onChange={handleCcaChange}
          placeholder="Select CCA"
        />
      </div>
      <button className="save-button" onClick={handleSave}>SAVE</button>
    </div>
  );
};

export default ProfileBuilderPage;