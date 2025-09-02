// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  //workshop userid 보내는용.  DEV방식. 
  const url = config.url || "";
  const path = url.startsWith("/") ? url : `/${url}`;
  if (path.startsWith("/workshops")) {
    const uid = localStorage.getItem("userId") 
               || (JSON.parse(localStorage.getItem("user")||"null")?.id);
    if (uid) config.headers["X-User-Id"] = uid;
  }
  return config;
});

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

// 회원 관련 API만 남김
export const authAPI = {
  checkId: (data) => api.post('/auth/check-id', data), // 아이디 중복확인
  verifyEmail: (data) => api.post('/auth/verify-email', data), // 인증코드 전송 요청 및 재전송 요청
  confirmEmail: (data) => api.post('/auth/confirm-email', data), // 인증코드 입력 확인

  signUp: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMyInfo: () => api.get('/auth/me'),
  updateMyInfo: (data) => api.put('/auth/me', data),
};

// workshops
export const workshopAPI = {
  list: () => api.get("/workshops"),
  get: (workshopId) => api.get(`/workshops/${workshopId}`),
  create: (data) => api.post("/workshops", data),
  update: (workshopId, data) => api.patch(`/workshops/${workshopId}`, data),
  remove: (workshopId) => api.delete(`/workshops/${workshopId}`),
};

export const threadAPI = {
  list: (workshopId) => api.get(`/workshops/${workshopId}/threads`),
  get: (workshopId, threadId) => api.get(`/workshops/${workshopId}/threads/${threadId}`),
  create: (workshopId, data) => api.post(`/workshops/${workshopId}/threads`, data),
  update: (workshopId, threadId, data) => api.patch(`/workshops/${workshopId}/threads/${threadId}`, data),
  remove: (workshopId, threadId) => api.delete(`/workshops/${workshopId}/threads/${threadId}`),
};


// lounges (workshop 종속)
export const loungeAPI = {
  list: (workshopId) => api.get(`/workshops/${workshopId}/lounges`),
  get: (workshopId, loungeId) => api.get(`/workshops/${workshopId}/lounges/${loungeId}`),
  create: (workshopId, data) => api.post(`/workshops/${workshopId}/lounges`, data),
  update: (workshopId, loungeId, data) => api.patch(`/workshops/${workshopId}/lounges/${loungeId}`, data),
  remove: (workshopId, loungeId) => api.delete(`/workshops/${workshopId}/lounges/${loungeId}`),
};

// messages (lounge 종속)
export const messageAPI = {
  list: (workshopId, loungeId) => api.get(`/workshops/${workshopId}/lounges/${loungeId}/messages`),
  send: (workshopId, loungeId, data) => api.post(`/workshops/${workshopId}/lounges/${loungeId}/messages`, data),
  edit: (workshopId, loungeId, messageId, data) => api.patch(`/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`, data),
  remove: (workshopId, loungeId, messageId) => api.delete(`/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`),
};

// files (lounge 종속)
export const fileAPI = {
  upload: (workshopId, loungeId, formData) =>
    api.post(`/workshops/${workshopId}/lounges/${loungeId}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  download: (workshopId, loungeId, fileId) =>
    api.get(`/workshops/${workshopId}/lounges/${loungeId}/files/${fileId}`, {
      responseType: "blob",
    }),
  remove: (workshopId, loungeId, fileId) =>
    api.delete(`/workshops/${workshopId}/lounges/${loungeId}/files/${fileId}`),
};

// services/api.js 맨 아래 추가
export const postAPI = {
  list: (threadId, { sort, keyword }) =>
    axios.get(`/api/threads/${threadId}/posts`, {
      params: { sort, keyword },
    }),
  create: (threadId, post) =>
    axios.post(`/api/threads/${threadId}/posts`, post),
};


export default api;