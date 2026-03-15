import axios from 'axios';

const api = axios.create({
  baseURL: '/', 
  timeout: 10000,  
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase.auth.token') || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response để handle error chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ví dụ: nếu 401 → redirect login
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default api;