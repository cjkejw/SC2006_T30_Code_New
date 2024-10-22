import axios from 'axios';

const API_BASE_URL = 'https://localhost:5073'; // Adjust to your backend URL

export const findSchool = async (school: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/school/find`, {
            params: { school },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching school details", error);
        throw error;
    }
};

export const recommendSchools = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/school/recommend`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } // If using JWT tokens
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching recommended schools", error);
        throw error;
    }
};

export const compareSchools = async (school1: string, school2: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/school/compare`, {
            params: { school1, school2 },
        });
        return response.data;
    } catch (error) {
        console.error("Error comparing schools", error);
        throw error;
    }
};
