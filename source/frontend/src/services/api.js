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

  // 로그인: POST /auth/login  { id, password }
  // (응답 token은 localStorage.setItem('token', token) 으로 저장)
  login: (data) => api.post("/auth/login", data),

  // ✅ 내정보: GET/PUT /user-info
  getMyInfo: () => api.get("/user-info"),
  // ✅ 닉네임 등 업데이트: 백엔드가 POST만 받으므로 POST로 수정
  updateMyInfo: (data) => api.post("/user-info", data),
  // ✅ 현재 비밀번호 확인 → 비번 변경 UX용
  verifyPassword: (data) => api.post("/user-info/verify-password", data),   // { currentPassword }
  updatePassword: (data) => api.post("/user-info/update-password", data),   // { currentPassword, newPassword }
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
    api.delete(
      `/workshops/${workshopId}/lounges/${loungeId}/messages/${messageId}`
    ),
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
    api.get(`/workshops/${workshopId}/lounges/${loungeId}/files/${fileId}`, {
      responseType: "blob",
    }),
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
    api.patch(
      `/workshops/${workshopId}/threads/${threadId}/posts/${postId}/views`
    ),

  // 수정 (PUT 또는 PATCH - 보통 PUT 사용)
  update: (workshopId, threadId, postId, payload) =>
    api.patch(
      `/workshops/${workshopId}/threads/${threadId}/posts/${postId}`,
      payload
    ),

  // 삭제
  delete: (workshopId, threadId, postId) =>
    api.delete(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`),
};

/* ===== Comments ===== */
export const commentAPI = {
  list: (wid, tid, pid, page = 0, size = 50) =>
    api.get(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, {
      params: { page, size },
    }),
  create: (wid, tid, pid, content, parentId = null) =>
    api.post(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, {
      content,
      parentId,
    }),
  update: (wid, tid, pid, cid, content) =>
    api.patch(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments/${cid}`, {
      content,
    }),
  remove: (wid, tid, pid, cid) =>
    api.delete(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments/${cid}`),
};

/* ===== Mates ===== */
export const mateApi = {
  // 친구 목록: GET /api/mates/{myId}  또는 /api/mate/{myId}
  // (백엔드 라우트에 맞춰 한 줄만 쓰세요. 예시는 /mates 사용)
  list: (myId) => api.get(`/mate/${myId}`),

  // 가이드 고정: POST /api/mate/search { id }
  search: (id) => api.post("/mate/search", { id }),

  // 친구 추가: POST /api/mate/append { senderId, receiverId }
  append: (senderId, receiverId) =>
    api.post("/mate/append", { senderId, receiverId }),

  // 친구 삭제: POST /api/mate/remove { id, targetId }
  remove: (id, targetId) => api.post("/mate/remove", { id, targetId }),

  // 요청 처리(수락/거절): POST /api/mate/append/handle { senderId, receiverId, isAccepted }
  handle: (senderId, receiverId, isAccepted) =>
    api.post("/mate/append/handle", { senderId, receiverId, isAccepted }),
};

/* ===== Block ===== */
export const blockApi = {
  // 차단자 목록: GET /api/block/{id}
  // 응답 : {blocklist: Array<{id, nickname, imageUrl}>}
  list: (id) => api.get(`/block/${id}`),
  // 차단 실행
  blockUser: (id, targetId) => api.post("/block/block-user", { id, targetId }),
  unblockUser: (id, targetId) =>
    api.post("/block/unblock-user", { id, targetId }),
};

/* ===== Schedules ===== */
export const scheduleApi = {
  getStats: (workshopId) => api.get(`/workshops/${workshopId}/schedules/stats`),

  listIncomplete: (workshopId) =>
    api.get(`/workshops/${workshopId}/schedules/incomplete`),

  // 🔹 전체 목록(워크샵)
  listAll: (workshopId) => api.get(`/workshops/${workshopId}/schedules`),

  // 🔹 생성
  create: (workshopId, payload) =>
    api.post(`/workshops/${workshopId}/schedules`, payload),

  // 🔹 단일 조회(서버 라우트가 있을 때)
  getOne: (scheduleId) => api.get(`/schedules/${scheduleId}`),

  // 🔹 수정
  update: (scheduleId, payload) => api.put(`/schedules/${scheduleId}`, payload),

  // 🔹 삭제
  remove: (scheduleId) => api.delete(`/schedules/${scheduleId}`),
};

export default api;
