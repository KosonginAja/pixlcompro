import axios from 'axios';

const api = axios.create({
  // IMPORTANT: Ganti ini ke URL API aslimu (misal: https://api.pixlcraft.studio/api)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
