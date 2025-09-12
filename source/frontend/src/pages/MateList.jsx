/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { mateApi } from "../services/api";
import { Link } from "react-router-dom";
import MateSearchBox from "../Components/Mate/MateSearchBox";
import FriendRemoveButton from "../Components/Mate/FriendRemoveButton";
import BlockUserButton from "../Components/Mate/BlockUserButton";

export default function MateList() {
  // 로그인 시 저장해 둔 내 아이디를 꺼내는 예시
  const myId =
    JSON.parse(localStorage.getItem("user") || "{}")?.id || "Kim_developer";

  // 친구 목록 데이터
  const [mates, setMates] = useState([]);
  // 목록 로딩중 표시
  const [loading, setLoading] = useState(false);
  // "사용자 검색" 박스를 보여줄지 말지 (버튼으로 토글)
  const [showSearch, setShowSearch] = useState(false);

  // 페이지 들어오면 친구 목록 불러오기
  const load = async () => {
    setLoading(true);
    try {
      // GET /api/mates/{myId}
      const { data } = await mateApi.list(myId);

      // DTO 확정 : 배열은 data.matelist
      setMates(Array.isArray(data?.matelist) ? data.matelist : []);
    } catch (e) {
      console.error(e);
      setMates([]);
      alert(e?.response?.data?.message || "목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [myId]); //최초 1회

  // 삭제 콜백: 버튼에서 성공하면 여기로 targetId를 알려줌
  const handleRemoved = (targetId) => {
    // UI 즉시 반영
    setMates((prev) => prev.filter((m) => m.id !== targetId));
    // 서버에서 최신 목록 다시 로드
    load();
  };

  const handleBlocked = (targetId) => {
    // 차단 시 목록에서 숨김
    setMates((prev) => prev.filter((m) => m.id !== targetId));
    // 서버에서 최신 목록 다시 로드
    load();
  };

  // 수락된 친구만
  const friends = Array.isArray(mates)
    ? mates.filter((m) => m?.status === "FRIEND" || m?.isAccepted === true)
    : [];

  // (상대 수락 대기)
  const pendingSent = Array.isArray(mates)
    ? mates.filter(
        (m) =>
          m?.status === "PENDING_SENT" ||
          (m?.isAccepted !== true && m?.requesterIsSender === true)
      )
    : [];

  // 내가 받은 대기
  const pendingReceived = Array.isArray(mates)
    ? mates.filter(
        (m) =>
          m?.status === "PENDING_RECEIVED" ||
          (m?.isAccepted !== true && m?.requesterIsSender === false)
      )
    : [];

  return (
    <div>
      <h2>친구 목록</h2>
      {/* 목록 영역 */}
      {loading ? (
        <div>불러오는 중...</div>
      ) : friends.length === 0 ? (
        <div>친구가 없습니다.</div>
      ) : (
        <ul>
          {friends.map((m) => (
            <li key={m.id}>
              {m.nickname} (@{m.id}){/* 친구 옆 삭제 버튼 */}
              <FriendRemoveButton
                myId={myId}
                targetId={m.id}
                onRemoved={handleRemoved}
              />
              <BlockUserButton
                myId={myId}
                targetId={m.id}
                onBlocked={handleBlocked}
              />
            </li>
          ))}
        </ul>
      )}
      {/* 새로고침 버튼 */}
      <div>
        <button onClick={load}>새로고침</button>
      </div>
      {/* 사용자 검색 버튼 */}
      <div>
        <button onClick={() => setShowSearch((v) => !v)}>
          {showSearch ? "사용자 검색 닫기" : "사용자 검색"}
        </button>
      </div>
      {/* 차단 목록 */}
      <div>
        <Link to="/mates/blocked">차단 목록</Link>
      </div>
      {/* 친구 추가 판별 -> 수락된 친구만 넘김 */}
      {showSearch && <MateSearchBox myId={myId} friends={friends} />}
      {/* 보낸 요청 */}
      <h3>보낸 친구 요청</h3>
      {pendingSent.length === 0 ? (
        <div>보낸 요청이 없습니다.</div>
      ) : (
        <ul>
          {pendingSent.map((m) => (
            <li key={m.id}>
              {m.nickname} (@{m.id})
              <button
                onClick={async () => {
                  await mateApi.remove(myId, m.id);
                  load();
                }}
              >
                요청 취소
              </button>
            </li>
          ))}
        </ul>
      )}{" "}
      {/* 보낸 요청 */}
      {/* 받은 요청 */}
      <h3>받은 친구 요청</h3>
      {pendingReceived.length === 0 ? (
        <div>받은 요청이 없습니다.</div>
      ) : (
        <ul>
          {pendingReceived.map((m) => (
            <li key={m.id}>
              {m.nickname} (@{m.id})
              <button
                onClick={async () => {
                  await mateApi.handle(m.id, myId, true);
                  load();
                }}
              >
                수락
              </button>
              <button
                onClick={async () => {
                  await mateApi.handle(m.id, myId, false);
                  load();
                }}
              >
                거절
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
