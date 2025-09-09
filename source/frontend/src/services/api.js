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
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ===== Auth ===== */
export const authAPI = {
  // 아이디 중복확인: POST /auth/check-id  { id }
  checkId: (data) => api.post("/auth/check-id", data),
  // 이메일 인증 시작/재전송: POST /auth/verify-email  { email, requestTime }
  verifyEmail: (data) => api.post("/auth/verify-email", data),

  // 이메일 인증 확인: POST /auth/confirm-email  { email, verificationCode, requestTime }
  confirmEmail: (data) => api.post("/auth/confirm-email", data),
  signUp: (data) => api.post("/auth/signup", data),

  // 응답 token을 localStorage.setItem('token', token) 로 저장
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
  get: (workshopId, threadId) =>
    api.get(`/workshops/${workshopId}/threads/${threadId}`),
  create: (workshopId, data) =>
    api.post(`/workshops/${workshopId}/threads`, data),
  update: (workshopId, threadId, data) =>
    api.patch(`/workshops/${workshopId}/threads/${threadId}`, data),
  remove: (workshopId, threadId) =>
    api.delete(`/workshops/${workshopId}/threads/${threadId}`),
};

/* ===== Lounges ===== */
export const loungeAPI = {
  list: (workshopId) => api.get(`/workshops/${workshopId}/lounges`),
  get: (workshopId, loungeId) =>
    api.get(`/workshops/${workshopId}/lounges/${loungeId}`),
  create: (workshopId, data) =>
    api.post(`/workshops/${workshopId}/lounges`, data),
  update: (workshopId, loungeId, data) =>
    api.patch(`/workshops/${workshopId}/lounges/${loungeId}`, data),
  remove: (workshopId, loungeId) =>
    api.delete(`/workshops/${workshopId}/lounges/${loungeId}`),
};

/* ===== Messages ===== */
export const messageAPI = {
  list: (workshopId, loungeId) =>
    api.get(`/workshops/${workshopId}/lounges/${loungeId}/messages`),
  send: (workshopId, loungeId, data) =>
    api.post(`/workshops/${workshopId}/lounges/${loungeId}/messages`, data),
  edit: (workshopId, loungeId, messageId, data) =>
    api.patch(
      `/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`,
      data
    ),
  remove: (workshopId, loungeId, messageId) =>
    api.delete(`/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`),
  create: (workshopId, loungeId, payload) =>
    api.post(`/workshops/${workshopId}/lounges/${loungeId}/messages`, payload),
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
  // 게시글 목록
  list: (workshopId, threadId, { page, size, sort, keyword } = {}) =>
    api.get(`/workshops/${workshopId}/threads/${threadId}/posts`, {
      params: { page, size, sort, keyword },
    }),

  // 게시글 단건
  get: (workshopId, threadId, postId) =>
    api.get(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`),

  // (옵션) 생성 — 지금은 본문표시만 필요하므로 사용 안 함
  create: (workshopId, threadId, payload) =>
    api.post(`/workshops/${workshopId}/threads/${threadId}/posts`, payload),

  // 조회수 증가 (백엔드가 PATCH /views 라우트일 때)
  increaseViews: (workshopId, threadId, postId) =>
    api.patch(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}/views`),
};

export const commentAPI = {
    list: (wid, tid, pid, page=0, size=50) =>
    api.get(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, { params: { page, size } }),
  create: (wid, tid, pid, content, parentId=null) =>
    api.post(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, { content, parentId }),
  update: (wid, tid, pid, cid, content) =>
    api.patch(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments/${cid}`, { content }),
  remove: (wid, tid, pid, cid) =>
    api.delete(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments/${cid}`),
};

/* ===== Mates ===== */
export const mateApi = {
  getList: (id) => api.get(`/mates/${id}`), // 친구 목록 조회
  search: (id) => api.post("/mates/search", { id }), // 사용자 검색
  append: (senderId, receverId) => api.post("/append", { senderId, receverId }), // 친구 추가
  remove: (id, targetId) => api.post("/remove", { id, targetId }), // 친구 삭제
  handle: (senderId, receverId, isAccepted) =>
    api.post("/appendHandle", { senderId, receverId, isAccepted }), // 친구 요청 처리
};

// ===== Schedules =====
export const scheduleApi = {
  getStats: (workshopId) =>
    api.get(`/workshops/${workshopId}/schedules/stats`),

  listIncomplete: (workshopId) =>
    api.get(`/workshops/${workshopId}/schedules/incomplete`),

  // 🔹 전체 목록(워크샵)
  listAll: (workshopId) =>
    api.get(`/workshops/${workshopId}/schedules`),

  // 🔹 생성
  create: (workshopId, payload) =>
    api.post(`/workshops/${workshopId}/schedules`, payload),

  // 🔹 (옵션) 단일 조회가 서버에 없을 수 있으니, 폼에서 listAll로 대체 사용
  getOne: (scheduleId) =>
    api.get(`/schedules/${scheduleId}`),

  // 🔹 수정
  update: (scheduleId, payload) =>
    api.put(`/schedules/${scheduleId}`, payload),

  // 🔹 삭제
  remove: (scheduleId) =>
    api.delete(`/schedules/${scheduleId}`),
};

export default api;
