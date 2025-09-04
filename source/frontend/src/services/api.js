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
  if (config.data instanceof FormData) {
    // boundary 자동 설정하게 두기
    delete config.headers["Content-Type"];
  }
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

/* ===== Auth =====
   ✅ 백엔드 DTO와 동일한 바디/경로로 보냄 */
export const authAPI = {
  // 아이디 중복확인: POST /auth/check-id  { id }
  checkId: (data) => api.post("/auth/check-id", data),

  // 이메일 인증 시작/재전송: POST /auth/verify-email  { email, requestTime }
  verifyEmail: (data) => api.post("/auth/verify-email", data),

  // 이메일 인증 확인: POST /auth/confirm-email  { email, verificationCode, requestTime }
  confirmEmail: (data) => api.post("/auth/confirm-email", data),

  // 회원가입: POST /auth/signup  { id, password, nickname, email }
  signUp: (data) => api.post("/auth/signup", data),

  // 로그인: POST /auth/login  { id, password } → token은 응답으로 돌아옴
  login: (data) => api.post("/auth/login", data),

  // ✅ 내정보: GET/PUT /user-info  (AuthController 기준으로 변경)
  getMyInfo: () => api.get("/user-info"),
  updateMyInfo: (data) => api.put("/user-info", data),
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
  create: (workshopId, loungeId, payload) =>
    api.post(`/workshops/${workshopId}/lounges/${loungeId}/messages`, payload),
};

export const fileAPI = {
  // 백엔드: POST /api/messages/files (multipart)
  uploadToMessage: (workshopId, loungeId, messageId, file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("workshopId", String(workshopId));
    fd.append("loungeId", String(loungeId));
    fd.append("messageId", String(messageId));
    return api.post(`/messages/files`, fd); // baseURL에 /api 포함
  },
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
