import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ComparisonResults, { School } from '../../components/ComparisonResults/ComparisonResults';

const ComparisonResultsPage: React.FC = () => {
  useEffect(() => {
    document.title = "Comparison Results";
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the state from location
  const { school1, school2 } = location.state || {};

  // Redirect back if no schools are provided
  if (!school1 || !school2) {
    navigate('/compare');
    return null;
  }

  return (
    <div>
      <ComparisonResults school1={school1 as School} school2={school2 as School} />
    </div>
  );
};

export default ComparisonResultsPage;