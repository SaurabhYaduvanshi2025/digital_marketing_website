// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  // Backend API ka base entry point
  baseURL: 'http://localhost:8000/api/v1',
  
  // Session cookie (PHPSESSID) ko browser se backend bhejne ke liye mandatory
  withCredentials: true,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;