import React, { useEffect, useMemo, useRef, useState } from "react";
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
  return JSON.parse(trimmed);
}

export default function MySetting() {
  const [info, setInfo] = useState({
    id: "",
    nickname: "",
    email: "",
    emailPassword: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 닉네임 편집 모드/값
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState("");

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
          const normalized = normalizeUserInfo(data);
          setInfo(normalized);
          setNicknameDraft(normalized.nickname || "");
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const imgSrc = useMemo(() => (info.imageUrl ? resolveImageUrl(info.imageUrl) : "/img/simple_user.png"), [info.imageUrl]);

  function copy(text) {
    if (!navigator || !navigator.clipboard || !navigator.clipboard.writeText) return;
    navigator.clipboard.writeText(text || "").then(() => {}, () => {});
  }

  /** 프로필 이미지 업로드 (왼쪽 UI 로직은 유지) */
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

  /** 닉네임 저장 */
  const onSaveNickname = () => {
    const newNickname = (nicknameDraft || "").trim();
    if (!newNickname) {
      alert("닉네임을 입력하세요.");
      return;
    }
    if (newNickname === info.nickname) {
      setEditingNickname(false);
      return;
    }
    authAPI
      .updateMyInfo({ newNickname })
      .then((r) => (r && r.data) || null)
      .then((data) => {
        if (!data) throw new Error();
        setInfo((prev) => ({ ...prev, nickname: data.nickname || newNickname }));
        setEditingNickname(false);
        // 로컬 캐시 반영
        const raw = typeof localStorage !== "undefined" ? localStorage.getItem("user") : null;
        const parsed = safeParseUser(raw);
        if (parsed) {
          parsed.nickname = data.nickname || newNickname;
          localStorage.setItem("user", JSON.stringify(parsed));
        }
        alert("닉네임이 변경되었습니다.");
      })
      .catch(() => alert("닉네임 변경에 실패했습니다."));
  };

  /** 비밀번호 변경 (값은 표시하지 않음) */
  const onChangePassword = async () => {
    const current = window.prompt("현재 비밀번호를 입력하세요.");
    if (current == null) return;
    if (!current.trim()) {
      alert("현재 비밀번호를 입력하세요.");
      return;
    }

    try {
      const v = await authAPI.verifyPassword({ currentPassword: current });
      const ok = v && v.data && v.data.isValid;
      if (!ok) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
    } catch {
      alert("현재 비밀번호 확인 중 오류가 발생했습니다.");
      return;
    }

    const np1 = window.prompt("새 비밀번호를 입력하세요.");
    if (np1 == null) return;
    const np2 = window.prompt("새 비밀번호를 한 번 더 입력하세요.");
    if (np2 == null) return;

    if (!np1.trim() || !np2.trim()) {
      alert("새 비밀번호를 모두 입력하세요.");
      return;
    }
    if (np1 !== np2) {
      alert("두 비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    if (np1.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      await authAPI.updatePassword({ currentPassword: current, newPassword: np1 });
      alert("비밀번호가 변경되었습니다. 다시 로그인해야 할 수 있습니다.");
    } catch {
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <section className="settings-page">
      <div className="settings-main">
        {/* 헤더: 제목만 '마이페이지'로, 우측 버튼 제거 */}
        <div className="settings-header">
          <h1 className="settings-title">마이페이지</h1>
          {/* (우측 새로고침/닫기 제거) */}
        </div>

        {loading ? (
          <div className="settings-skeleton" aria-busy="true">불러오는 중…</div>
        ) : err ? (
          <div className="settings-error">{err}</div>
        ) : (
          <section className="settings-card">
            {/* 1) 왼쪽 프로필 사진 영역: 원본 유지 */}
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

            {/* 2) 오른쪽 정보: 원래 디자인 유지 + 요구사항 반영 */}
            <div className="settings-right">
              <div className="section-title">계정</div>

              {/* 아이디: 텍스트표시 + 복사 버튼 유지 */}
              <div className="kv-row">
                <div className="kv-label">아이디</div>
                <div className="kv-value">{info.id || "-"}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={() => copy(info.id)} disabled={!info.id}>복사</button>
                </div>
              </div>

              {/* 비밀번호: 값 표시 X, 변경하기 버튼만 */}
              <div className="kv-row">
                <div className="kv-label">비밀번호</div>
                <div className="kv-value">{/* 비워둠 */}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={onChangePassword}>변경하기</button>
                </div>
              </div>

              {/* 닉네임: 기본은 텍스트 + '변경' 버튼, 편집 시 인풋 + '완료' */}
              <div className="kv-row">
                <div className="kv-label">닉네임</div>
                <div className="kv-value">
                  {editingNickname ? (
                    <input
                      className="inp"
                      value={nicknameDraft}
                      onChange={(e) => setNicknameDraft(e.target.value)}
                      placeholder="닉네임을 입력하세요"
                      autoFocus
                    />
                  ) : (
                    info.nickname || "-"
                  )}
                </div>
                <div className="kv-ctrl">
                  {editingNickname ? (
                    <button className="chip" onClick={onSaveNickname}>완료</button>
                  ) : (
                    <button className="chip" onClick={() => setEditingNickname(true)}>변경</button>
                  )}
                </div>
              </div>

              {/* 이메일: 텍스트표시 + 복사 버튼 유지 */}
              <div className="kv-row">
                <div className="kv-label">이메일</div>
                <div className="kv-value">{info.email || "-"}</div>
                <div className="kv-ctrl">
                  <button className="chip" onClick={() => copy(info.email)} disabled={!info.email}>복사</button>
                </div>
              </div>

              {/* 제거됨: 이메일 비밀번호, 프로필 이미지 URL */}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}