import React from 'react';
import './SearchResultItem.css';

interface SearchResultItemProps {
  schoolName: string;
  schoolType: string;
  website: string;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ schoolName, schoolType, website }) => {
  return (
    <div className="result-item">
      <h3>{schoolName}</h3>
      <p>{schoolType}</p>
      {website ? (
        <a href={website} target="_blank" rel="noopener noreferrer">
          Visit School Website
        </a>
      ) : (
        <p>No website available</p>
      )}
    </div>
  );
};

export default SearchResultItem;
