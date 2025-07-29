// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 인증 실패 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 회원 관련 API만 남김
export const authAPI = {
  signUp: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMyInfo: () => api.get('/auth/me'),
  updateMyInfo: (data) => api.put('/auth/me', data),
};
// 상품 관련 API
export const productAPI = {
  getProducts: (page = 0, size = 10) => 
    api.get(`/products?page=${page}&size=${size}`),
  
  getProduct: (productId) => 
    api.get(`/products/${productId}`),
  
  searchProducts: (params) => 
    api.get('/products/search', { params }),
  
  getLatestProducts: () => 
    api.get('/products/latest'),
  
  createProduct: (data) => 
    api.post('/products', data),
  
  updateProduct: (productId, data) => 
    api.put(`/products/${productId}`, data),
  
  deleteProduct: (productId) => 
    api.delete(`/products/${productId}`),
};
export default api;
