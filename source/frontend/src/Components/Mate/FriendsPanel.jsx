/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./FriendsPanel.css";
import "../Dashboard/Dashboard.css";
import MateSearchBox from "./MateSearchBox";
// import FriendAddButton from "./FriendAddButton"; // 필요 시 사용
import FriendRemoveButton from "./FriendRemoveButton";
import UnblockUserButton from "./UnblockUserButton";
import { authAPI, mateApi, blockApi } from "../../services/api";

export default function FriendsPanel() {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const sp = new URLSearchParams(search);
  const isOpen = sp.get("friends") === "open";

  // =========================
  //  내 아이디 준비 (캐시 → API)
  // =========================
  const cachedId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}")?.id || null;
    } catch {
      return null;
    }
  })();
  const [myId, setMyId] = useState(cachedId);

  useEffect(() => {
    if (myId) return; // 캐시에 있으면 호출 불필요
    authAPI
      .getMyInfo()
      .then((res) => setMyId(res?.data?.id || null))
      .catch(() => {
        // 실패 시 그대로 두되, 데이터 로딩 useEffect에서 myId 없으면 호출 안 함
      });
  }, [myId]);

  // ==============
  //  탭 상태 관리
  // ==============
  const [tab, setTab] = useState("friends");

  // 패널이 열릴 때마다 초기 탭으로
  useEffect(() => {
    if (isOpen) setTab("friends");
  }, [isOpen]);

  const close = () => {
    // 닫을 때도 다음 오픈을 위해 초기화
    setTab("friends");
    sp.delete("friends");
    nav(`${pathname}?${sp.toString()}`, { replace: false });
  };

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // =========
  //  데이터
  // =========
  const [mates, setMates] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [blocked, setBlocked] = useState([]);

  // 응답 → 항상 배열로 정규화
  const toArray = (x) => {
    if (Array.isArray(x)) return x;
    if (Array.isArray(x?.data)) return x.data;
    if (Array.isArray(x?.list)) return x.list;
    if (Array.isArray(x?.mates)) return x.mates;
    if (Array.isArray(x?.blocklist)) return x.blocklist;
    if (Array.isArray(x?.blocks)) return x.blocks;
    return [];
  };

  // 열릴 때 + myId 준비됐을 때 로딩
  useEffect(() => {
    if (!isOpen || !myId) return;

    (async () => {
      try {
        const reqs = [
          mateApi?.list?.(myId), // 내 친구 목록
          mateApi?.sentRequests?.(), // 보낸 요청(없으면 undefined)
          mateApi?.receivedRequests?.(), // 받은 요청(없으면 undefined)
          blockApi?.list?.(myId), // 차단 목록
        ].map((p) => p?.catch?.(() => ({ data: [] })));

        const [matesRes, sentRes, recvRes, blockRes] = await Promise.all(reqs);

        setMates(toArray(matesRes));
        setSent(toArray(sentRes));
        setReceived(toArray(recvRes));
        setBlocked(toArray(blockRes));
      } catch {
        // 개별 실패는 무시 (UI는 열려 있어야 함)
      }
    })();
  }, [isOpen, myId]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`dashboard-overlay friends-overlay ${isOpen ? "open" : ""}`}
      aria-modal="true"
      role="dialog"
    >
      {/* 배경 */}
      <div className="backdrop" onClick={close} />

      {/* 오른쪽 시트 */}
      <aside className="sheet">
        <header className="sheet-header">
          <h3>친구</h3>
          <button className="icon-btn" onClick={close} aria-label="닫기">
            닫기
          </button>
        </header>

        {/* 탭 */}
        <nav className="tabs">
          <button
            className={`tab ${tab === "friends" ? "is-active" : ""}`}
            onClick={() => setTab("friends")}
          >
            친구 목록
          </button>
          <button
            className={`tab ${tab === "sent" ? "is-active" : ""}`}
            onClick={() => setTab("sent")}
          >
            보낸 요청
          </button>
          <button
            className={`tab ${tab === "received" ? "is-active" : ""}`}
            onClick={() => setTab("received")}
          >
            받은 요청
          </button>
          <button
            className={`tab ${tab === "blocked" ? "is-active" : ""}`}
            onClick={() => setTab("blocked")}
          >
            차단 목록
          </button>
          <button
            className={`tab ${tab === "search" ? "is-active" : ""}`}
            onClick={() => setTab("search")}
          >
            사용자 검색
          </button>
        </nav>

        <section className="sheet-body">
          {tab === "friends" && (
            <List
              emptyText="친구가 없습니다."
              rows={mates}
              render={(u) => (
                <div className="list-item">
                  <div className="title">
                    @{u.id} <span className="nick">{u.nickname}</span>
                  </div>
                  <div className="muted">{u.email}</div>
                  <FriendRemoveButton
                    myId={myId}
                    targetId={u.id}
                    onRemoved={() =>
                      setMates((m) => m.filter((x) => x.id !== u.id))
                    }
                  />
                </div>
              )}
            />
          )}

          {tab === "sent" && (
            <List
              emptyText="보낸 요청이 없습니다."
              rows={sent}
              render={(r) => (
                <div className="list-item">
                  <div className="title">@{r.targetId}</div>
                  <div className="muted">대기</div>
                  {/* 요청 취소 버튼이 있다면 여기 배치 */}
                </div>
              )}
            />
          )}

          {tab === "received" && (
            <List
              emptyText="받은 요청이 없습니다."
              rows={received}
              render={(r) => (
                <div className="list-item">
                  <div className="title">@{r.fromId}</div>
                  <div className="actions">{/* 수락/거절 버튼 영역 */}</div>
                </div>
              )}
            />
          )}

          {tab === "blocked" && (
            <List
              emptyText="차단 목록이 비었습니다."
              rows={blocked}
              render={(b) => (
                <div className="list-item">
                  <div className="title">
                    @{b.id} <span className="nick">{b.nickname}</span>
                  </div>
                  <UnblockUserButton
                    myId={myId}
                    targetId={b.id}
                    onUnblocked={() =>
                      setBlocked((list) => list.filter((x) => x.id !== b.id))
                    }
                  />
                </div>
              )}
            />
          )}

          {tab === "search" && (
            <div className="search-pane">
              <MateSearchBox
                onSelected={(user) => {
                  // 여기서 FriendAddButton 사용해도 되고,
                  // MateSearchBox 내부에서 처리 중이면 생략해도 OK
                }}
              />
            </div>
          )}
        </section>
      </aside>
    </div>,
    document.body
  );
}

function List({ rows = [], render, emptyText = "데이터가 없습니다." }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <div className="empty">
        <strong>{emptyText}</strong>
        <span>우측 탭에서 다른 항목을 확인해보세요.</span>
      </div>
    );
  }
  return (
    <div className="list">
      {rows.map((row, i) => (
        <div key={row.id || row._id || i} className="list-row">
          {render(row)}
        </div>
      ))}
    </div>
  );
}
