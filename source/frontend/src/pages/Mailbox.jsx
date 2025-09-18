import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import UserFooter from "../Components/UserFooter";
import Sidebar from "../Components/Sidebar";
import LoungeSection from "../Components/LoungeSection";
import ThreadSection from "../Components/ThreadSection";
import { mailAPI, authAPI, workshopAPI, loungeAPI, threadAPI } from "../services/api";
import "./WorkShopDetail.css"; // wsd 레이아웃 재사용

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

function ListItem({ mail, onClick }) {
  const date = useMemo(() => {
    try { return new Date(mail.writtenAt).toLocaleString(); }
    catch { return mail.writtenAt; }
  }, [mail.writtenAt]);

  return (
    <div
      onClick={() => onClick(mail)}
      style={{
        padding: 12,
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        display: "grid",
        gap: 6,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 600, wordBreak: "break-all" }}>
        {mail.subject || "(제목 없음)"}
      </div>
      <div style={{ fontSize: 13, color: "#666" }}>
        From: {mail.from} &nbsp;&nbsp; To: {mail.to}
      </div>
      <div style={{ fontSize: 12, color: "#999" }}>{date}</div>
    </div>
  );
}

export default function Mailbox() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromQuery = location.search || "";
  const workshopId = useFromWorkshopId();

  // 게이트: 연동 안되어 있으면 /mail/login으로 (from 유지)
  const [gateChecked, setGateChecked] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAPI.getMyInfo();
        if (!data?.emailPassword) {
          navigate(`/mail/login${fromQuery}`, { replace: true });
          return;
        }
      } catch {
        // 조회 실패 시에도 로그인으로
        navigate(`/mail/login${fromQuery}`, { replace: true });
        return;
      }
      setGateChecked(true);
    })();
  }, [navigate, fromQuery]);

  // 메일 목록/상세
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [detail, setDetail] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [replyTo, setReplyTo] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendBusy, setSendBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!gateChecked) return;
    (async () => {
      try {
        setError("");
        const { data } = await mailAPI.mailbox({ page, size });
        setItems(data?.content || []);
        setTotalPages(data?.totalPages ?? 0);
      } catch (e) {
        setError(e?.response?.data?.message || "메일함을 불러오는 중 문제가 발생했습니다.");
      }
    })();
  }, [gateChecked, page, size]);

  const openDetail = async (mail) => {
    try {
      setError("");
      const mailId = mail.mailId ?? mail.id ?? mail.mailID;
      const { data } = await mailAPI.read(mailId);
      const m = data?.mail || data || mail;
      setDetail(m);
      setAttachments(data?.attachments || []);
      setReplyTo((m.from || mail.from || "").trim());
      const subj = (m.subject || mail.subject || "").trim();
      setReplySubject(subj.startsWith("Re:") ? subj : `Re: ${subj}`.trim());
      setReplyBody(`\n\n---- Original Message ----\n${m.content || mail.content || ""}`);
    } catch (e) {
      setError(e?.response?.data?.message || "메일을 여는 중 문제가 발생했습니다.");
    }
  };

  const sendReply = async () => {
    if (!replyTo) {
      setError("받는 사람 주소(to)를 입력해주세요.");
      return;
    }
    setSendBusy(true);
    setError("");
    try {
      await mailAPI.send({ to: replyTo, subject: replySubject, content: replyBody });
      alert("전송했습니다.");
    } catch (e) {
      setError(e?.response?.data?.message || "전송 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSendBusy(false);
    }
  };

  // 우측 보조 사이드바(선택된 워크샵) 데이터 로딩
  const [ws, setWs] = useState(null);
  const [lounges, setLounges] = useState([]);
  const [threads, setThreads] = useState([]);
  useEffect(() => {
    if (!workshopId) return;
    workshopAPI.get(workshopId).then(({ data }) => setWs(data));
    loungeAPI.list(workshopId).then(({ data }) => setLounges(Array.isArray(data) ? data : []));
    threadAPI.list(workshopId).then((res) => setThreads(Array.isArray(res?.data) ? res.data : []));
  }, [workshopId]);

  if (!gateChecked) {
    return (
      <div className="page page--mail">
        <Header />
        <Sidebar />
        <div className="wsd__layout">
          <section className="wsd__content" style={{ padding: 24 }}>불러오는 중…</section>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="page page--mail">
      <Header />
      {/* 좌측 고정 워크샵 레일 */}
      <Sidebar />

      {/* 본문 레이아웃: 우측 보조 사이드바(선택 시) + 콘텐츠 */}
      <div className="wsd__layout">
        {workshopId && (
          <aside className="wsd__sidebar">
            <h3 className="wsd__title" title={ws?.workshopName || ws?.name || "Workshop"}>
              {ws?.workshopName || ws?.name || "Workshop"}
            </h3>
            <LoungeSection workshopId={workshopId} lounges={lounges} setLounges={setLounges} />
            <ThreadSection workshopId={workshopId} threads={threads} setThreads={setThreads} />
          </aside>
        )}

        <section className="wsd__content">
          {/* 상단 바(옵션): 새로고침 */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontWeight: 700 }}>받은메일함</h3>
            <button
              onClick={async () => {
                try {
                  await mailAPI.refresh(); // 백엔드: GET /api/mail/mailbox (메일 서버 동기화)
                  // 성공 메시지는 서버에서 주지만, UX상 목록 재조회도 해줌
                  const { data } = await mailAPI.mailbox({ page, size });
                  setItems(data?.content || []);
                  setTotalPages(data?.totalPages ?? 0);
                } catch (e) {
                  setError(e?.response?.data?.message || "메일 새로고침 중 오류가 발생했습니다.");
                }
              }}
              style={{ padding: "6px 10px" }}
            >
              새로고침
            </button>
          </div>

          {error && (
            <div style={{ color: "#c00", marginBottom: 8 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", minHeight: 420 }}>
            {/* 좌측 목록 */}
            <div style={{ borderRight: "1px solid #eee", overflowY: "auto", background: "#fff" }}>
              {items.map((m) => (
                <ListItem
                  key={m.mailId ?? m.id ?? `${m.from}-${m.messageId ?? ""}`}
                  mail={m}
                  onClick={openDetail}
                />
              ))}
              <div style={{ display: "flex", gap: 8, padding: 12 }}>
                <button disabled={page <= 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
                  이전
                </button>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  다음
                </button>
              </div>
            </div>

            {/* 우측 상세/답장 */}
            <div style={{ overflowY: "auto", background: "#fff" }}>
              {detail ? (
                <div style={{ padding: 16 }}>
                  <div style={{ borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {detail.subject || "(제목 없음)"}
                    </div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                      From: {detail.from} &nbsp;&nbsp; To: {detail.to}
                    </div>

                    {/* 서버가 HTML 본문을 줄 수도 있음 */}
                    {detail?.content?.includes?.("<") ? (
                      <div style={{ fontSize: 14, marginTop: 12, whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{ __html: detail.content || "" }} />
                    ) : (
                      <pre style={{ fontSize: 14, marginTop: 12, whiteSpace: "pre-wrap" }}>
                        {detail.content || ""}
                      </pre>
                    )}

                    {!!attachments?.length && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>첨부파일</div>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {attachments.map((url, idx) => (
                            <li key={idx}>
                              <a href={url} target="_blank" rel="noreferrer">
                                {url}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* 답장 */}
                  <div style={{ display: "grid", gap: 8 }}>
                    <h4 style={{ margin: "4px 0" }}>답장</h4>
                    <input
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                      placeholder="받는 사람 (to)"
                      style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                    />
                    <input
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="제목"
                      style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                    />
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="내용"
                      rows={10}
                      style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button disabled={sendBusy} onClick={sendReply}>
                        {sendBusy ? "전송 중…" : "전송"}
                      </button>
                      <button onClick={() => setDetail(null)}>닫기</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 24, color: "#666" }}>왼쪽 목록에서 메일을 선택하세요.</div>
              )}
            </div>
          </div>
        </section>
      </div>

      <UserFooter />
    </div>
  );
}