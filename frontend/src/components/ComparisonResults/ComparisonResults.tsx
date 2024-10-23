import React from 'react';
import './ComparisonResults.css';

export type School = {
  name: string;
  zone: string;
  location: string;
  subjects: string[];
  distinctProgrammes: string | null;
  CCAs: string[];
};

interface ComparisonResultsProps {
  school1: School;
  school2: School;
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
          <p>Zone: {school1.zone}</p>
          <p>Location: {school1.location}</p>
          <p>Subjects Offered: {/*{school1.subjects.join(', ')}*/}</p>
          <p>Distinctive Programmes: {school1.distinctProgrammes || 'NIL'}</p>
          <p>CCAs Offered: {/*{school1.CCAs.join(', ')}*/}</p>
        </div>
        <div className="school-card">
          <h2>{school2.name}</h2>
          <p>Zone: {school2.zone}</p>
          <p>Location: {school2.location}</p>
          <p>Subjects Offered: {/*{school2.subjects.join(', ')}*/}</p>
          <p>Distinctive Programmes: {school2.distinctProgrammes || 'NIL'}</p>
          <p>CCAs Offered: {/*{school2.CCAs.join(', ')}*/}</p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;