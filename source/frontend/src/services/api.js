// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ 모든 요청에 JWT 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ 401 시 토큰 정리 후 로그인으로
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ===== Auth ===== */
export const authAPI = {
  checkId: (data) => api.post("/auth/check-id", data),        // 아이디 중복확인
  verifyEmail: (data) => api.post("/auth/verify-email", data),// 인증코드 전송/재전송
  confirmEmail: (data) => api.post("/auth/confirm-email", data),
  signUp: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),             // 응답 token을 localStorage.setItem('token', token) 로 저장
  getMyInfo: () => api.get("/auth/me"),
  updateMyInfo: (data) => api.put("/auth/me", data),
};

/* ===== Workshops ===== */
export const workshopAPI = {
  list: () => api.get("/workshops"),
  get: (workshopId) => api.get(`/workshops/${workshopId}`),
  create: (data) => api.post("/workshops", data),
  update: (workshopId, data) => api.patch(`/workshops/${workshopId}`, data),
  remove: (workshopId) => api.delete(`/workshops/${workshopId}`),
};

/* ===== Threads ===== */
export const threadAPI = {
  list: (workshopId) => api.get(`/workshops/${workshopId}/threads`),
  get: (workshopId, threadId) => api.get(`/workshops/${workshopId}/threads/${threadId}`),
  create: (workshopId, data) => api.post(`/workshops/${workshopId}/threads`, data),
  update: (workshopId, threadId, data) => api.patch(`/workshops/${workshopId}/threads/${threadId}`, data),
  remove: (workshopId, threadId) => api.delete(`/workshops/${workshopId}/threads/${threadId}`),
};

/* ===== Lounges ===== */
export const loungeAPI = {
  list: (workshopId) => api.get(`/workshops/${workshopId}/lounges`),
  get: (workshopId, loungeId) => api.get(`/workshops/${workshopId}/lounges/${loungeId}`),
  create: (workshopId, data) => api.post(`/workshops/${workshopId}/lounges`, data),
  update: (workshopId, loungeId, data) => api.patch(`/workshops/${workshopId}/lounges/${loungeId}`, data),
  remove: (workshopId, loungeId) => api.delete(`/workshops/${workshopId}/lounges/${loungeId}`),
};

/* ===== Messages ===== */
export const messageAPI = {
  list: (workshopId, loungeId) => api.get(`/workshops/${workshopId}/lounges/${loungeId}/messages`),
  send: (workshopId, loungeId, data) => api.post(`/workshops/${workshopId}/lounges/${loungeId}/messages`, data),
  edit: (workshopId, loungeId, messageId, data) =>
    api.patch(`/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`, data),
  remove: (workshopId, loungeId, messageId) =>
    api.delete(`/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`),
};

/* ===== Files ===== */
export const fileAPI = {
  upload: (workshopId, loungeId, formData) =>
    api.post(`/workshops/${workshopId}/lounges/${loungeId}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  download: (workshopId, loungeId, fileId) =>
    api.get(`/workshops/${workshopId}/lounges/${loungeId}/files/${fileId}`, { responseType: "blob" }),
  remove: (workshopId, loungeId, fileId) =>
    api.delete(`/workshops/${workshopId}/lounges/${loungeId}/files/${fileId}`),
};

/* ===== Posts ===== */
export const postAPI = {
  list: (threadId, { sort, keyword }) =>
    axios.get(`/api/threads/${threadId}/posts`, {
      params: { sort, keyword },
    }),
  create: (threadId, post) =>
    axios.post(`/api/threads/${threadId}/posts`, post),
};

export default api;
