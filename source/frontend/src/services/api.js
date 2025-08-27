// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

//백엔드 실제 엔드포인트: "/api/schedules"
const SCHEDULAR_PATH = '/schedules';

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

// ===== 여기 추가 =====
export const workshopAPI = {
  create: (data) => api.post('/workshops', data),
  list:   () => api.get('/workshops'),
  get:    (id) => api.get(`/workshops/${id}`),
  update: (id, data) => api.patch(`/workshops/${id}`, data),
  remove: (id) => api.delete(`/workshops/${id}`),
};
// ====================

export const loungeAPI = {
  list:   (wId)                => api.get(`/workshops/${wId}/lounges`),
  get:    (wId, lId)           => api.get(`/workshops/${wId}/lounges/${lId}`),
  create: (wId, data)          => api.post(`/workshops/${wId}/lounges`, data),
  update: (wId, lId, data)     => api.patch(`/workshops/${wId}/lounges/${lId}`, data),
  remove: (wId, lId)           => api.delete(`/workshops/${wId}/lounges/${lId}`),
}

export const messageAPI = {
  getMessages: (chatroomId) =>
    api.get(`/chatrooms/${chatroomId}/messages`),
  sendMessage: (chatroomId, data) =>
    api.post(`/chatrooms/${chatroomId}/messages`, data),
  editMessage: (chatroomId, messageId, data) =>
    api.patch(`/chatrooms/${chatroomId}/messages/${messageId}`, data),
  deleteMessage: (chatroomId, messageId, data) =>
    api.delete(`/chatrooms/${chatroomId}/messages/${messageId}`, {
      data, // DELETE에 body 보낼 땐 'data' 키로 감싸야 함!
    }),
};

export const fileAPI = {
  upload: (formData) =>
    api.post('/messages/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// 스케줄러 API 래퍼 추가 - yjy
export const schedularAPI = {
  // list
  getAll: () => api.get(SCHEDULAR_PATH),
  // create
  create: (data) => api.post(SCHEDULAR_PATH, data),
  // update
  update: (id, data) => api.put(`${SCHEDULAR_PATH}/${id}`, data),
  // delete
  remove: (id) => api.delete(`${SCHEDULAR_PATH}/${id}`),
  // stats
  getStats: () => api.get(`${SCHEDULAR_PATH}/stats`),
};

export default api;
