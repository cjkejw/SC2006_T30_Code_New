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

const RecommendationsPage: React.FC<{ userId?: number }> = ({ userId }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [recommendedSchools, setRecommendedSchools] = useState<School[]>([]);

    useEffect(() => {
        document.title = "Recommended Schools";
    }, []);

    // Fetch user profile
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5073/profile/${userId}`, {
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
        }
    }, [userId]);

    // Fetch recommendations based on profile filters
    const fetchRecommendations = (profile: UserProfile) => {
        axios.get(`http://localhost:5073/api/schools/search`, {
            params: {
                educationLevel: profile.educationLevel,
                zone: profile.zone,
                subjects: profile.subjects,
                programs: profile.programs,
                ccas: profile.ccas
            }
        })
        .then(response => {
            setRecommendedSchools(response.data);
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
                        <p>Education Level: {school.educationLevel}</p>
                        <p>Zone: {school.zone}</p>
                        <div className="recommendation-buttons">
                            <a href={school.infoUrl} target="_blank" rel="noopener noreferrer" className="btn">
                                School Information
                            </a>
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
