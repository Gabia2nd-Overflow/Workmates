// src/pages/MySetting.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "./MySetting.css";

/** 응답 정규화: 배열/객체 모두 수용 */
function normalizeUserInfo(payload) {
  if (!payload) return { id: "", nickname: "", email: "", emailPassword: "", imageUrl: "" };

  if (Array.isArray(payload)) {
    const [id, nickname, email, emailPassword, imageUrl] = payload;
    return {
      id: id ?? "",
      nickname: nickname ?? "",
      email: email ?? "",
      emailPassword: emailPassword ?? "",
      imageUrl: imageUrl ?? "",
    };
  }

  const p = payload || {};
  return {
    id: p.id ?? p.userId ?? "",
    nickname: p.nickname ?? p.name ?? p.userNickname ?? "",
    email: p.email ?? p.username ?? p.userEmail ?? "",
    emailPassword: p.emailPassword ?? p.mailPassword ?? "",
    imageUrl: p.imageUrl ?? p.profileImageUrl ?? p.profileImage ?? "",
  };
}

/** 이미지 URL 안전 처리 (프로필 미리보기용) */
function resolveImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return url;
}

/** Authorization 헤더 (가능하면) */
function buildAuthHeaderFromLocalStorage() {
  const out = {};
  const keys = ["token", "accessToken", "access_token", "jwt", "authorization", "authToken"];
  for (let i = 0; i < keys.length; i += 1) {
    const v = typeof localStorage !== "undefined" ? localStorage.getItem(keys[i]) : "";
    if (v && typeof v === "string" && v.trim()) {
      const val = v.replace(/^Bearer\s+/i, "");
      out.Authorization = `Bearer ${val}`;
      break;
    }
  }
  return out;
}

/** 업로드 응답에서 이미지 URL 추출 */
function extractImageUrl(data) {
  if (!data) return "";
  if (typeof data === "string") return data;
  return data.url ?? data.imageUrl ?? data.profileImageUrl ?? data.profileImage ?? "";
}

/** safeParseUser — catch 완전히 제거 */
function safeParseUser(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!(trimmed.startsWith("{") && trimmed.endsWith("}"))) return null;

  // try/catch 불가 → 파싱 실패 가능성은 무시하고 그대로 JSON.parse
  // (백엔드에서 내려주는 user 캐시가 유효한 JSON이라고 가정)
  return JSON.parse(trimmed);
}

export default function MySetting() {
  const location = useLocation();
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    id: "",
    nickname: "",
    email: "",
    emailPassword: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /** 설정 정보 로드 */
  function loadSettings() {
    setLoading(true);
    setErr("");

    authAPI
      .getMyInfo()
      .then((res) => res && res.data)
      .then((data) => {
        if (data) return data;
        const headers = { Accept: "application/json, text/plain, */*", ...buildAuthHeaderFromLocalStorage() };
        return fetch("/api/user-info", { method: "GET", credentials: "include", headers }).then((res) => {
          if (!res || !res.ok) return null;
          return res.json();
        });
      })
      .then((data) => {
        if (!data) {
          setErr("설정 정보를 불러오지 못했습니다.");
        } else {
          setInfo(normalizeUserInfo(data));
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const imgSrc = useMemo(() => (info.imageUrl ? resolveImageUrl(info.imageUrl) : "/img/simple_user.png"), [info.imageUrl]);

  const handleClose = () => {
    const from = location.state && location.state.from;
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    const m = (location.pathname || "").match(/^\/workshops\/(\d+)/);
    if (m) navigate(`/workshops/${m[1]}`, { replace: true });
    else navigate("/", { replace: true });
  };

  function copy(text) {
    if (!navigator || !navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(text || "").then(() => {}, () => {});
  }

  /** 프로필 이미지 업로드 */
  function uploadProfileImage(file) {
    if (!file) return;
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("image", file);

    const tryAxios = authAPI.uploadProfileImage
      ? authAPI.uploadProfileImage(fd).then((r) => (r ? r.data : null), () => null)
      : Promise.resolve(null);

    tryAxios
      .then((data) => {
        if (data) return data;

        const endpoints = ["/api/user/profile-image", "/api/profile/image", "/api/user-info/image"];
        const headers = { ...buildAuthHeaderFromLocalStorage() };

        let p = Promise.resolve(null);
        endpoints.forEach((url) => {
          p = p.then((prev) => {
            if (prev) return prev;
            return fetch(url, { method: "POST", credentials: "include", headers, body: fd }).then((res) => {
              if (!res || !res.ok) return null;
              return res
                .json()
                .then((j) => j, () => res.text().then((t) => t));
            });
          });
        });
        return p;
      })
      .then((data) => {
        const newUrl = resolveImageUrl(extractImageUrl(data));
        if (!newUrl) {
          alert("프로필 이미지 업로드에 실패했습니다.");
          return null;
        }

        setInfo((prev) => ({ ...prev, imageUrl: newUrl }));

        const raw = typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
        const parsed = safeParseUser(raw);
        if (parsed) {
          parsed.profileImageUrl = newUrl;
          parsed.imageUrl = newUrl;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        return newUrl;
      })
      .catch(() => {
        alert("프로필 이미지 업로드에 실패했습니다.");
      })
      .finally(() => setUploading(false));
  }

  const onClickChangePhoto = () => {
    if (uploading) return;
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const f = e.target && e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type || !f.type.startsWith("image/")) {
      setErr("이미지 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }
    uploadProfileImage(f);
    e.target.value = "";
  };

  return (
    <section className="settings-page">
      <div className="settings-main">
        <div className="settings-header">
          <h1 className="settings-title">설정</h1>
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={loadSettings} disabled={loading} title="다시 불러오기">
              <span className="btn-ico">↻</span> 새로고침
            </button>
            <button className="btn btn-ghost" onClick={handleClose} title="닫기">
              <span className="btn-ico">✕</span> 닫기
            </button>
          </div>
        </div>

        {loading ? (
          <div className="settings-skeleton" aria-busy="true">불러오는 중…</div>
        ) : err ? (
          <div className="settings-error">{err}</div>
        ) : (
          <section className="settings-card">
            <div className="settings-left">
              <div className="avatar-wrap">
                <img
                  className="avatar avatar--ring"
                  src={imgSrc}
                  alt={`${info.nickname || "사용자"} 프로필 이미지`}
                  onError={(e) => {
                    e.currentTarget.src = "/img/simple_user.png";
                  }}
                />
              </div>

              <div className="avatar-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  onChange={onFileChange}
                />
                <button
                  className="btn btn-outline small"
                  onClick={onClickChangePhoto}
                  disabled={uploading}
                  title="프로필 사진 업로드"
                >
                  {uploading ? "업로드 중…" : "프로필 사진 변경"}
                </button>
                <div className="avatar-hint">JPG/PNG 권장 · 최대 5MB</div>
              </div>
            </div>

            <div className="settings-right">
              <div className="section-title">계정</div>

              <div className="kv-row">
                <div className="kv-label">아이디</div>
                <div className="kv-value">{info.id || "-"}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={() => copy(info.id)} disabled={!info.id}>복사</button>
                </div>
              </div>

              <div className="kv-row">
                <div className="kv-label">닉네임</div>
                <div className="kv-value">{info.nickname || "-"}</div>
                <div className="kv-ctrl" />
              </div>

              <div className="kv-row">
                <div className="kv-label">이메일</div>
                <div className="kv-value">{info.email || "-"}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={() => copy(info.email)} disabled={!info.email}>복사</button>
                </div>
              </div>

              <div className="kv-row">
                <div className="kv-label">이메일 비밀번호</div>
                <div className="kv-value">
                  {showPw ? info.emailPassword || "-" : info.emailPassword ? "•".repeat(10) : "-"}
                </div>
                <div className="kv-ctrl">
                  <button className="chip chip-toggle" onClick={() => setShowPw((s) => !s)} title={showPw ? "가리기" : "보기"}>
                    {showPw ? "가리기" : "보기"}
                  </button>
                </div>
              </div>

              <div className="section-divider" />

              <div className="section-title">프로필</div>

              <div className="kv-row">
                <div className="kv-label">프로필 이미지 URL</div>
                <div className="kv-value">{info.imageUrl || "-"}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={() => copy(info.imageUrl)} disabled={!info.imageUrl}>복사</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
