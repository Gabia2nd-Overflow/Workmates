// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

/* -----------------------------------------------------------
 *  Token helpers
 * --------------------------------------------------------- */
function readToken() {
  try {
    const fromKey = localStorage.getItem("token"); // 기존 사용
    const accessToken = localStorage.getItem("accessToken"); // 혹시 다른 키로 저장했을 때
    const fromUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    )?.accessToken; // user 내부에 저장했을 때
    return fromKey || accessToken || fromUser || null;
  } catch {
    return null;
  }
}

function attachAuth(config) {
  const token = readToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

/* -----------------------------------------------------------
 *  Interceptors
 * --------------------------------------------------------- */
// 모든 요청에 JWT 자동 첨부
api.interceptors.request.use(attachAuth);

// 401/403 발생 시 토큰 정리 후 로그인으로 이동
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // 인증 만료/무효
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      // user는 유지하고 싶으면 아래 라인 주석 처리
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* ===== Auth ===== */
export const authAPI = {
  checkId: (data) => api.post("/auth/check-id", data),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  confirmEmail: (data) => api.post("/auth/confirm-email", data),
  signUp: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),

  // 내 정보
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
  list: (workshopId, threadId, { page, size, sort, keyword } = {}) =>
    api.get(`/workshops/${workshopId}/threads/${threadId}/posts`, {
      params: { page, size, sort, keyword },
    }),
  get: (workshopId, threadId, postId) =>
    api.get(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`),
  create: (workshopId, threadId, payload) =>
    api.post(`/workshops/${workshopId}/threads/${threadId}/posts`, payload),
  increaseViews: (workshopId, threadId, postId) =>
    api.patch(
      `/workshops/${workshopId}/threads/${threadId}/posts/${postId}/views`
    ),
  update: (workshopId, threadId, postId, payload) =>
    api.patch(
      `/workshops/${workshopId}/threads/${threadId}/posts/${postId}`,
      payload
    ),
  delete: (workshopId, threadId, postId) =>
    api.delete(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`),
};

/* ===== Comments ===== */
export const commentAPI = {
  list: (wid, tid, pid, page = 0, size = 50) =>
    api.get(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, {
      params: { page, size },
    }),
  create: (wid, tid, pid, content, parentId = null, nickname) =>
    api.post(`/workshops/${wid}/threads/${tid}/posts/${pid}/comments`, {
      content,
      parentId,
      nickname
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
  // 친구 목록: GET /api/mate/{myId}
  list: (myId) => api.get(`/mate/${myId}`),

  // 검색
  search: (id) => api.post("/mate/search", { id }),

  // 친구 추가/삭제
  append: (senderId, receiverId) =>
    api.post("/mate/append", { senderId, receiverId }),
  remove: (id, targetId) => api.post("/mate/remove", { id, targetId }),

  // 요청 처리(수락/거절)
  handle: (senderId, receiverId, isAccepted) =>
    api.post("/mate/append/handle", { senderId, receiverId, isAccepted }),

  // (선택) 보낸/받은 요청이 백엔드에 있으면 이런 식으로 추가 가능
  // sentRequests: () => api.get("/mate/requests/sent"),
  // receivedRequests: () => api.get("/mate/requests/received"),
};

/* ===== Block ===== */
export const blockApi = {
  list: (id) => api.get(`/block/${id}`),
  blockUser: (id, targetId) => api.post("/block/block-user", { id, targetId }),
  unblockUser: (id, targetId) =>
    api.post("/block/unblock-user", { id, targetId }),
};

/* ===== Schedules ===== */
export const scheduleApi = {
  getStats: (workshopId) => api.get(`/workshops/${workshopId}/schedules/stats`),
  listIncomplete: (workshopId) =>
    api.get(`/workshops/${workshopId}/schedules/incomplete`),
  listAll: (workshopId) => api.get(`/workshops/${workshopId}/schedules`),
  create: (workshopId, payload) =>
    api.post(`/workshops/${workshopId}/schedules`, payload),
  getOne: (scheduleId) => api.get(`/schedules/${scheduleId}`),
  update: (scheduleId, payload) => api.put(`/schedules/${scheduleId}`, payload),
  remove: (scheduleId) => api.delete(`/schedules/${scheduleId}`),
};

/* ===== Mail ===== */
export const mailAPI = {
  // 최초 연동(비밀번호 저장) — POST /api/user-info (body: { newEmailPassword })
  updateEmailPassword: (newEmailPassword) => authAPI.updateMyInfo({ newEmailPassword }),
  // 받은 메일함 — GET /api/mail?page&size
  mailbox: ({ page = 0, size = 20 } = {}) => api.get(`/mail`, { params: { page, size } }),
  // 단일 메일 읽기 — GET /api/mail/{mailId}
  read: (mailId) => api.get(`/mail/${mailId}`),
  // 보낸 메일함 — GET /api/mail/sent?page&size
  sent: ({ page = 0, size = 20 } = {}) => api.get(`/mail/sent`, { params: { page, size } }),
  // 메일 전송 — POST /api/mail
  send: (payload) => api.post(`/mail`, payload),
  // 메일함 새로고침(서버에서 메일 DB 갱신 트리거) — GET /api/mail/mailbox
  refresh: () => api.get(`/mail/mailbox`),
};

export default api;
