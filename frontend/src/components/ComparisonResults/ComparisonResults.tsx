import React from 'react';
import './ComparisonResults.css';

export type School = {
  name: string;
  zone: string;
  location: string;
  subjects: string[];
  distinctProgrammes: string[];
  cca: string[];
};

interface ComparisonResultsProps {
  school1: School;
  school2: School;
}

function toPascalCase(str: string): string {
  return str
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' '); 
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({ school1, school2 }) => {
  return (
    <div className="comparison-results">
      <div className="comparison-header">
        <h1>Compare Results</h1>
      </div>
      <div className="school-comparison-container">
        <div className="school-card">
          <h2>{school1.name}</h2>
          <p>Zone: {toPascalCase(school1.zone)}</p>
          <p>Location: {toPascalCase(school1.location)}</p>
          <p>Subjects Offered: {Array.isArray(school1.subjects) && school1.subjects.length > 0 ? school1.subjects.join(', ') : "Unknown"}</p>
          <p>Distinctive Programmes: {Array.isArray(school1.distinctProgrammes) && school1.distinctProgrammes.length > 0 ? school1.distinctProgrammes.join(', ') : 'NIL'}</p>
          <p>CCAs Offered: {Array.isArray(school1.cca) && school1.cca.length > 0 ? school1.cca.map(toPascalCase).join(', '): "Unknown"}</p>
        </div>
        <div className="school-card">
          <h2>{school2.name}</h2>
          <p>Zone: {toPascalCase(school2.zone)}</p>
          <p>Location: {toPascalCase(school2.location)}</p>
          <p>Subjects Offered: {Array.isArray(school2.subjects) && school2.subjects.length > 0 ? school2.subjects.join(', ') : "Unknown"}</p>
          <p>Distinctive Programmes: {Array.isArray(school2.distinctProgrammes) && school2.distinctProgrammes.length > 0 ? school2.distinctProgrammes.join(', ') : 'NIL'}</p>
          <p>CCAs Offered: {Array.isArray(school2.cca) && school2.cca.length > 0 ? school2.cca.map(toPascalCase).join(', ') : "Unknown"}</p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;