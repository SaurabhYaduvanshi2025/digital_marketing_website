// src/api/axios.js
import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const apiBaseUrl = import.meta.env.DEV
  ? '/api/v1'
  : `${configuredApiUrl.replace(/\/$/, '')}/v1`;

// The PHP router currently appends `null` after controller responses. Remove
// only that trailing router output before Axios parses the JSON response.
const parseApiResponse = (response) => {
  if (typeof response !== 'string') return response;

  const json = response.trim().replace(/\s*null\s*$/, '');
  if (!json) return response;

  try {
    return JSON.parse(json);
  } catch {
    return response;
  }
};

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [parseApiResponse],
});

export default api;
