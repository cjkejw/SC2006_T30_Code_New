import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecommendationsPage.css';

interface UserProfile {
    educationLevel: string;
    zone: string;
    subjects: string[];
    programs: string[];
    ccas: string[];
}

interface School {
    id: number;
    name: string;
    educationLevel: string;
    zone: string;
    subjects: string[];
    programs: string[];
    ccas: string[];
    website: string;
    infoUrl: string;
}

const RecommendationsPage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [recommendedSchools, setRecommendedSchools] = useState<School[]>([]);

    useEffect(() => {
        document.title = "Recommended Schools";
        fetchUserProfile(); // Call directly without checking for userId
    }, []);

    // Fetch user profile
    const fetchUserProfile = () => {
        axios.get(`http://localhost:5073/profile/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const profile = response.data;
            setUserProfile(profile);
            fetchRecommendations(profile);
        })
        .catch(error => {
            console.error("Failed to fetch user profile:", error);
        });
    };

    // Fetch recommendations based on profile filters
    const fetchRecommendations = (profile: UserProfile) => {
        axios.get(`http://localhost:5073/school/recommend`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const schoolsData = response.data;
    
            // Convert the response object into an array of school objects with exact property names
            const schoolsArray: School[] = Object.keys(schoolsData).map((key) => ({
                id: parseInt(key), // Use parseInt if `id` should be a number, or change `School` type if `id` should be a string
                name: key,
                educationLevel: schoolsData[key].educationLevel || "",  // Adjusting field name to match `School` type
                zone: schoolsData[key].zoneCode || "", // Adjusting field name to match `School` type
                subjects: schoolsData[key].subjects || [],
                programs: schoolsData[key].programmes || [], // Adjusting field name to match `School` type
                ccas: schoolsData[key].cca || [], // Adjusting field name to match `School` type
                website: schoolsData[key].urlAddress || "", 
                infoUrl: schoolsData[key].address || "", // Set as per your intended usage
            }));
    
            setRecommendedSchools(schoolsArray);
        })
        .catch(error => {
            console.error("Failed to fetch recommended schools:", error);
        });
    };
    

    return (
        <div className="recommendation-container">
            <h2>Recommended Schools</h2>
            {recommendedSchools.length > 0 ? (
                recommendedSchools.map(school => (
                    <div key={school.id} className="recommendation-card">
                        <h3>{school.name}</h3>
                        {/* <p>Education Level: {school.educationLevel}</p> */}
                        <p>Zone: {school.zone}</p>
                        <div className="recommendation-buttons">
                            <a href={school.website} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                Visit School Website
                            </a>
                        </div>
                    </div>
                ))
            ) : (
                <p>No schools match your profile. Try adjusting your criteria.</p>
            )}
        </div>
    );
};

export default RecommendationsPage;
