import React from "react";
import "./ProfileBuilderPage.css"; // Import your CSS for styling
import NavBar from "../../components/NavBar/NavBar";
const ProfileBuilderPage: React.FC = () => {
  return (
    <div className="profile-builder-page">
      <div className="profile-container">
        <h2>User Profile</h2>
        <div className="profile-picture-section">
          <div className="profile-picture">
            {/* Placeholder for profile picture */}
            <span>Edit Profile Picture</span>
          </div>
          <div className="user-info">
            <h3>Everly Evans</h3>
            <p>everlyevans@gmail.com</p>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="school-type">School Type</label>
          <select id="school-type">
            <option value="primary">Primary </option>
            <option value="secondary">Secondary </option>
            <option value="jc">Junior College </option>
            {/* Add other options as needed */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select id="location">
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="east">East</option>
            <option value="west">West</option>
            {/* Add location options */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subjects">Subjects</label>
          <select id="subjects">
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            {/* Add other subjects as needed */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="long-recess">Distinct Programme</label>
          <select id="long-recess">
            <option value="test">Test</option>
            {/* Add options */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="CCA">CCA</label>
          <select id="lunch-eating">
            <option value="lunch-eating">Lunch Eating</option>
            {/* Add options */}
          </select>
        </div>
        <button className="save-button">SAVE</button>
      </div>
    </div>
  );
};

export default ProfileBuilderPage;
