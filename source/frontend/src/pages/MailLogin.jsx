import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import UserFooter from "../Components/UserFooter";
import Sidebar from "../Components/Sidebar";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import { authAPI, mailAPI, workshopAPI, loungeAPI, threadAPI } from "../services/api";
import "./WorkShopDetail.css"; // wsd__layout / wsd__sidebar / wsd__content 재사용

// from 쿼리에서 /workshops/:id 형태의 경로를 파싱해 workshopId를 추출
function useFromWorkshopId() {
  const { search } = useLocation();
  return useMemo(() => {
    try {
      const sp = new URLSearchParams(search);
      const from = sp.get("from") || "";
      const m = from.match(/\/workshops\/(\d+)/);
      return m?.[1] || null;
    } catch {
      return null;
    }
  }, [search]);
}

export default function MailLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromQuery = location.search || "";
  const workshopId = useFromWorkshopId();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [error, setError] = useState("");

  // 우측 보조 사이드바(선택된 워크샵 전용) 상태
  const [ws, setWs] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);

  // 연동 여부 체크 + 사용자 이메일 표시
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAPI.getMyInfo();
        setUserEmail(data?.email || "");
        if (data?.emailPassword) {
          navigate(`/mail${fromQuery}`, { replace: true }); // 이미 연동 → 바로 메일함으로
          return;
        }
      } catch {
        // 무시하고 폼 노출
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, fromQuery]);

  // 우측 사이드바(워크샵 선택 시) 데이터 로딩
  useEffect(() => {
    if (!workshopId) return;
    workshopAPI.get(workshopId).then(({ data }) => setWs(data));
    loungeAPI.list(workshopId).then(({ data }) => setLounges(Array.isArray(data) ? data : []));
    threadAPI.list(workshopId).then((res) => setThreads(Array.isArray(res?.data) ? res.data : []));
  }, [workshopId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailPassword) {
      setError("네이버 메일 비밀번호를 입력해주세요.");
      return;
    }
    try {
      await mailAPI.updateEmailPassword(emailPassword);
      navigate(`/mail${fromQuery || ""}`); // 연동 완료 → 메일함으로
    } catch (e) {
      setError(e?.response?.data?.message || "비밀번호 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="page page--mail">
      <Header />
      {/* 좌측 고정 워크샵 레일 */}
      <Sidebar />

      {/* 메일 페이지 레이아웃: 좌측 ws-sidebar 폭을 비워두고, 우측에 wsd 레이아웃 사용 */}
      <div className="wsd__layout">
        {/* (조건부) 우측 보조 사이드바: 워크샵 선택된 경우에만 */}
        {workshopId && (
          <aside className="wsd__sidebar">
            <h3 className="wsd__title" title={ws?.workshopName || ws?.name || "Workshop"}>
              {ws?.workshopName || ws?.name || "Workshop"}
            </h3>
            <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
            <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
          </aside>
        )}

        {/* 본문 */}
        <section className="wsd__content">
          {loading ? (
            <div style={{ padding: 24 }}>불러오는 중…</div>
          ) : (
            <div
              style={{
                width: "min(560px, 92vw)",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              }}
            >
              <h2 style={{ marginBottom: 6 }}>외부 메일 연동 (네이버)</h2>
              <p style={{ color: "#666", marginBottom: 16 }}>
                네이버 메일 비밀번호를 저장하면 이 앱 내에서 <b>수신/열람/답장</b>이 가능합니다.
              </p>

              <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span>네이버 이메일 주소</span>
                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    placeholder="회원 가입 시 사용한 이메일(네이버)"
                    style={{
                      padding: 10,
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#fafafa",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                  <span>네이버 메일 비밀번호</span>
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="네이버 메일 비밀번호"
                    autoFocus
                    style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                  />
                  <small style={{ color: "#888" }}>서버에 암호화되어 저장됩니다.</small>
                </label>

                {error && <div style={{ color: "#c00", fontSize: 14 }}>{error}</div>}

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: 0,
                      background: "#1a73e8",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    연동하기
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      background: "#fff",
                    }}
                  >
                    이전으로
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>

      <UserFooter />
    </div>
  );
}