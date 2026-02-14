import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
