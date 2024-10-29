import React, { useEffect } from 'react';
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

const mockSchools: School[] = [
    {
        id: 1,
        name: 'Nanyang Primary School',
        educationLevel: 'Primary',
        zone: 'East',
        subjects: ['Math', 'Science', 'English'],
        programs: ['STEM', 'Bilingual'],
        ccas: ['Basketball', 'Art Club', 'Robotics'],
        website: 'https://nanyang.edu.sg',
        infoUrl: 'https://nanyang.edu.sg/info',
    },
    {
        id: 2,
        name: 'Raffles Institution',
        educationLevel: 'Secondary',
        zone: 'North',
        subjects: ['Math', 'Science', 'Humanities', 'English'],
        programs: ['Integrated Program', 'Gifted Education Program'],
        ccas: ['Debate', 'Tennis', 'Drama'],
        website: 'https://raffles.edu.sg',
        infoUrl: 'https://raffles.edu.sg/info',
    },
    {
        id: 3,
        name: 'Victoria School',
        educationLevel: 'Secondary',
        zone: 'East',
        subjects: ['Math', 'Science', 'Geography', 'History'],
        programs: ['Integrated Program', 'Leadership Program'],
        ccas: ['Soccer', 'Choir', 'Scouts'],
        website: 'https://victoria.edu.sg',
        infoUrl: 'https://victoria.edu.sg/info',
    },
    {
        id: 4,
        name: 'River Valley High School',
        educationLevel: 'Secondary',
        zone: 'West',
        subjects: ['Math', 'Biology', 'Chinese', 'Chemistry'],
        programs: ['Integrated Program', 'Bilingual Program'],
        ccas: ['Volleyball', 'Chinese Orchestra', 'Track and Field'],
        website: 'https://rivervalley.edu.sg',
        infoUrl: 'https://rivervalley.edu.sg/info',
    },
    {
        id: 5,
        name: 'Hwa Chong Institution',
        educationLevel: 'Secondary',
        zone: 'North',
        subjects: ['Math', 'Physics', 'Economics', 'Chemistry'],
        programs: ['Integrated Program', 'Science Research Program'],
        ccas: ['Basketball', 'Chess Club', 'Science Club'],
        website: 'https://hci.edu.sg',
        infoUrl: 'https://hci.edu.sg/info',
    }
];

// Main component with optional userProfile
const RecommendationsPage: React.FC<{ userProfile?: UserProfile }> = ({ userProfile }) => {
    useEffect(() => {
        document.title = "Recommendations";
    }, []);

    // Default user profile if none is provided
    const defaultUserProfile: UserProfile = {
        educationLevel: '',
        zone: '',
        subjects: [],
        programs: [],
        ccas: []
    };

    // Use passed userProfile or fallback to default
    const currentUserProfile = userProfile || defaultUserProfile;

    const filterSchools = (): School[] => {
        // If all fields in the profile are empty, show all schools
        const isProfileEmpty = 
            !currentUserProfile.educationLevel &&
            !currentUserProfile.zone &&
            currentUserProfile.subjects.length === 0 &&
            currentUserProfile.programs.length === 0 &&
            currentUserProfile.ccas.length === 0;

        if (isProfileEmpty) {
            return mockSchools;
        }

        // Otherwise, filter based on provided profile fields
        return mockSchools.filter((school) => {
            const matchesZone = currentUserProfile.zone ? school.zone === currentUserProfile.zone : true;
            const matchesEducationLevel = currentUserProfile.educationLevel ? school.educationLevel === currentUserProfile.educationLevel : true;

            // Check for common subjects, programs, or CCAs only if they are specified
            const matchesSubjects = currentUserProfile.subjects.length > 0 
                ? school.subjects.some(subject => currentUserProfile.subjects.includes(subject)) 
                : true;
            const matchesPrograms = currentUserProfile.programs.length > 0 
                ? school.programs.some(program => currentUserProfile.programs.includes(program)) 
                : true;
            const matchesCcas = currentUserProfile.ccas.length > 0 
                ? school.ccas.some(cca => currentUserProfile.ccas.includes(cca)) 
                : true;

            return matchesZone && matchesEducationLevel && (matchesSubjects || matchesPrograms || matchesCcas);
        });
    };

    const recommendedSchools = filterSchools();

    return (
        <div className="recommendation-container">
            <h2>Recommendation Results</h2>
            {recommendedSchools.length > 0 ? (
                recommendedSchools.map((school) => (
                    <div key={school.id} className="recommendation-card">
                        <img src="https://via.placeholder.com/60" alt="School" />
                        <div className="recommendation-details">
                            <h3>{school.name}</h3>
                            <p>Education Level: {school.educationLevel}</p>
                            <p>Zone: {school.zone}</p>
                        </div>
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
