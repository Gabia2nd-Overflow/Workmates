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
      // console.log("mateApi.list data:", res);

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.mates)
          ? data.mates
          : Array.isArray(data?.mateList)
            ? data.mateList
            : Array.isArray(data?.matelist)
              ? data.matelist
              : Array.isArray(data?.list)
                ? data.list
                : Array.isArray(data?.data)
                  ? data.data
                  : [];

      setMates(items);
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

  // ✅ 렌더에서도 "반드시 배열"만 map 하도록 보정
  const list = Array.isArray(mates) ? mates : [];

  return (
    <div>
      <h2>친구 목록</h2>

      {/* 목록 영역 */}
      {loading ? (
        <div>불러오는 중...</div>
      ) : mates.length === 0 ? (
        <div>친구가 없습니다.</div>
      ) : (
        <ul>
          {mates.map((m) => (
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

      {/* 버튼을 눌렀을 때만 검색 박스가 나타남 */}
      {showSearch && <MateSearchBox myId={myId} friends={mates} />}
      {/* friends={mates} <- FriendAddButton이 "이미 친구"를 판별 */}
    </div>
  );
}
