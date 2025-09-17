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
  
  // 절대 URL인 경우 그대로 반환
  if (/^https?:\/\//i.test(url)) return url;
  
  // 상대 경로 처리
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  // API 서버 기준 상대 경로
  return `${window.location.origin}/api/files/${url}`;
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
  
  console.log("서버 응답 데이터:", data); // 디버깅용
  
  // 문자열인 경우
  if (typeof data === "string") return data;
  
  // 객체인 경우 - 백엔드 응답 구조에 맞게 수정
  return data.imageUrl ?? 
         data.profileImageUrl ?? 
         data.url ?? 
         data.filePath ?? 
         "";
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

  // ▼ 비밀번호 인라인 편집 상태 (모달/alert 없이 같은 줄에서 처리)
  // step: 0=기본(버튼만), 1=현재 비밀번호 입력, 2=새 비밀번호 2회 입력
  const [pwStep, setPwStep] = useState(0);
  const [pwBusy, setPwBusy] = useState(false);
  const [pw, setPw] = useState({ current: "", new1: "", new2: "" });

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
  
  console.log("업로드 시작:", file.name, file.type, file.size);
  setUploading(true);

  // FormData 생성
  const formData = new FormData();
  formData.append("file", file);

  // 인증 헤더
  const headers = { ...buildAuthHeaderFromLocalStorage() };

  // 단일 방식으로 업로드
  fetch("/api/user-info", {
    method: "POST",
    credentials: "include",
    headers,
    body: formData
  })
  .then(async (response) => {
    console.log("응답 상태:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("업로드 실패:", response.status, errorText);
      throw new Error(`서버 오류 (${response.status}): ${errorText}`);
    }
    
    const contentType = response.headers.get("content-type");
    console.log("응답 Content-Type:", contentType);
    
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      const text = await response.text();
      console.log("응답 텍스트:", text);
      return text;
    }
  })
  .then((data) => {
    console.log("파싱된 응답 데이터:", data);
    
    const newUrl = extractImageUrl(data);
    const resolvedUrl = resolveImageUrl(newUrl);
    
    console.log("추출된 URL:", newUrl);
    console.log("최종 URL:", resolvedUrl);
    
    if (!resolvedUrl) {
      throw new Error("서버에서 이미지 URL을 반환하지 않았습니다.");
    }

    // 상태 업데이트
    setInfo((prev) => {
      const updated = { ...prev, imageUrl: resolvedUrl };
      console.log("상태 업데이트:", updated);
      return updated;
    });

    // localStorage 업데이트
    updateLocalStorage(resolvedUrl);
    
    // UserFooter 업데이트 알림
    window.dispatchEvent(new CustomEvent('userInfoUpdated'));

    alert("프로필 이미지가 성공적으로 변경되었습니다.");
  })
  .catch((error) => {
    console.error("프로필 이미지 업로드 실패:", error);
    alert(`프로필 이미지 업로드에 실패했습니다: ${error.message}`);
  })
  .finally(() => {
    setUploading(false);
  });
}

function updateLocalStorage(imageUrl) {
  try {
    const raw = localStorage.getItem("user");
    const parsed = safeParseUser(raw);
    if (parsed) {
      parsed.profileImageUrl = imageUrl;
      parsed.imageUrl = imageUrl;
      localStorage.setItem("user", JSON.stringify(parsed));
      console.log("localStorage 업데이트 완료:", parsed);
    }
  } catch (error) {
    console.warn("localStorage 업데이트 실패:", error);
  }
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
  /** 닉네임 저장 - FormData 사용으로 수정 */
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
    
    // FormData 사용으로 변경
    const formData = new FormData();
    formData.append("newNickname", newNickname);
    
    // authAPI.updateMyInfo를 직접 사용하는 대신 fetch 사용
    const headers = { ...buildAuthHeaderFromLocalStorage() };
    
    fetch("/api/user-info", {
      method: "POST",
      credentials: "include",
      headers,
      body: formData // FormData 전송
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
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
      
      // UserFooter 업데이트 알림
      window.dispatchEvent(new CustomEvent('userInfoUpdated'));
      
      alert("닉네임이 변경되었습니다.");
    })
    .catch(() => alert("닉네임 변경에 실패했습니다."));
  };

  // ▼ 비밀번호: 인라인 단계 전환 핸들러들 (prompt/alert 사용 X)
  const startPwChange = () => {
    if (pwBusy) return;
    setPwStep(1);                 // 현재 비밀번호 입력 단계
    setPw({ current: "", new1: "", new2: "" });
  };
  const cancelPwChange = () => {
    if (pwBusy) return;
    setPwStep(0);
    setPw({ current: "", new1: "", new2: "" });
  };
  const verifyCurrentPw = async () => {
    if (!pw.current.trim()) {
      alert("현재 비밀번호를 입력하세요.");
      return;
    }
    setPwBusy(true);
    try {
      const v = await authAPI.verifyPassword({ currentPassword: pw.current });
      const ok = v && v.data && v.data.isValid;
      if (!ok) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
      setPwStep(2); // 새 비밀번호 단계로
    } catch {
      alert("현재 비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setPwBusy(false);
    }
  };
  const submitNewPw = async () => {
    if (!pw.new1.trim() || !pw.new2.trim()) {
      alert("새 비밀번호를 모두 입력하세요.");
      return;
    }
    if (pw.new1 !== pw.new2) {
      alert("두 비밀번호가 서로 일치하지 않습니다.");
      return;
    }
    if (pw.new1.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    setPwBusy(true);
    try {
      await authAPI.updatePassword({ currentPassword: pw.current, newPassword: pw.new1 });
      alert("비밀번호가 변경되었습니다.");
      cancelPwChange();
    } catch {
      alert("비밀번호 변경에 실패했습니다.");
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <section className="settings-page">
      <div className="settings-main">
        {/* 헤더: 제목만 '마이페이지'로, 우측 버튼 제거 */}
        <div className="settings-header">
          <h1 className="settings-title">마이페이지</h1>
        </div>

        {loading ? (
          <div className="settings-skeleton" aria-busy="true">불러오는 중…</div>
        ) : err ? (
          <div className="settings-error">{err}</div>
        ) : (
          <section className="settings-card">
            {/* 왼쪽 프로필 사진 영역: 그대로 유지 */}
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

            {/* 오른쪽 정보: 원래 디자인 유지 + 요구사항 반영 */}
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

              {/* 비밀번호: 값 표시 X → 같은 줄에서 인라인 단계별 입력/검증 */}
              <div className="kv-row">
                <div className="kv-label">비밀번호</div>
                <div className="kv-value">
                  {pwStep === 0 && <span />}

                  {pwStep === 1 && (
                    <input
                      type="password"
                      className="inp"
                      placeholder="현재 비밀번호"
                      value={pw.current}
                      onChange={(e) => setPw((f) => ({ ...f, current: e.target.value }))}
                      autoFocus
                    />
                  )}

                  {pwStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <input
                        type="password"
                        className="inp"
                        placeholder="새 비밀번호"
                        value={pw.new1}
                        onChange={(e) => setPw((f) => ({ ...f, new1: e.target.value }))}
                        autoFocus
                      />
                      <input
                        type="password"
                        className="inp"
                        placeholder="새 비밀번호 확인"
                        value={pw.new2}
                        onChange={(e) => setPw((f) => ({ ...f, new2: e.target.value }))}
                      />
                    </div>
                  )}
                </div>
                <div className="kv-ctrl" style={{ display: "flex", gap: 6 }}>
                  {pwStep === 0 && (
                    <button className="chip" onClick={startPwChange}>변경하기</button>
                  )}
                  {pwStep === 1 && (
                    <>
                      <button className="chip" onClick={verifyCurrentPw} disabled={pwBusy || !pw.current}>다음</button>
                      <button className="chip" onClick={cancelPwChange} disabled={pwBusy}>취소</button>
                    </>
                  )}
                  {pwStep === 2 && (
                    <>
                      <button className="chip" onClick={submitNewPw} disabled={pwBusy}>변경</button>
                      <button className="chip" onClick={cancelPwChange} disabled={pwBusy}>취소</button>
                    </>
                  )}
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