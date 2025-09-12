import { useEffect, useMemo, useState } from "react";
import { blockApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import UnblockUserButton from "../Components/Mate/UnblockUserButton";

// 가이드 정규식: 소문자/숫자 4~20자
const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function BlockList() {
  const navigate = useNavigate();

  // 1) 내 아이디: 로그인 붙이면 localStorage 값으로 대체됨
  const myId =
    JSON.parse(localStorage.getItem("user") || "{}")?.id || "Kim_developer";

  // 2) 화면 상태들
  const [blocks, setBlocks] = useState([]); // [{id, nickname, imageUrl}, ...]
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 3) 내 아이디가 정규식 통과하는지 미리 계산
  const isValidMyId = useMemo(() => ID_REGEX.test(myId || ""), [myId]);

  // 4) 목록 불러오기
  // async: 이 함수는 Promise(비동기 결과)를 반환한다는 표시
  // await: 비동기 작업이 끝날 때까지 "이 줄에서 잠깐 기다려"
  const load = async () => {
    // 프론트 컷: 형식이 틀리면 서버 호출 자체를 하지 않음
    if (!isValidMyId) {
      setErr(
        "내 아이디 형식이 올바르지 않아서 목록을 불러올 수 없어요. (소문자/숫자 4~20자)"
      );
      setBlocks([]);
      return;
    }

    setLoading(true);
    setErr("");
    try {
      // GET /api/block/{id}
      const { data } = await blockApi.list(myId);

      // 가이드: 응답은 { blocklist: [...] }
      // 혹시 백엔드에서 대소문자 다르게 보낼 경우도 대비해 둘 다 체크
      setBlocks(data?.blocklist || data?.blockList || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "차단 목록을 불러오지 못했어요.");
    } finally {
      setLoading(false); // 성공/실패와 무관하게 항상 실행
    }
  };

  // 5) 첫 렌더링 시(그리고 myId 유효성 바뀌면) 목록 로드
  useEffect(() => {
    load();
  }, [isValidMyId]);

  // 차단 해제 성공 시 목록에서 제거
  const handleUnblocked = (targetId) => {
    setBlocks((prev) => prev.filter((u) => u.id !== targetId));
    load();
  };
  // 6) 화면 렌더
  return (
    <div style={{ padding: 16 }}>
      <h2>차단 목록</h2>

      <div>
        <button onClick={() => navigate(-1)}>뒤로</button>
        <button onClick={load}>새로고침</button>
      </div>

      {/* 아이디 형식이 잘못된 경우에만 경고 */}
      {!isValidMyId && (
        <div>내 아이디 형식이 올바르지 않습니다. (소문자/숫자 4~20자)</div>
      )}

      {/* 상태별 렌더링 */}
      {loading ? (
        <div>불러오는 중...</div>
      ) : err ? (
        <div>{err}</div>
      ) : blocks.length === 0 ? (
        <div>차단한 사용자가 없습니다.</div>
      ) : (
        <ul>
          {blocks.map((u) => (
            <li key={u.id}>
              <span style={{ flex: 1 }}>
                {u.nickname} (@{u.id})
              </span>

              {/*  차단 해제  */}
              <UnblockUserButton
                myId={myId}
                targetId={u.id}
                onUnblocked={handleUnblocked}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
