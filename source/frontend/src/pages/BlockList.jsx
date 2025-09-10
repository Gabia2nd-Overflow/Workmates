import { useEffect, useMemo, useState } from "react";
import { blockApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function BlockList() {
  const navigate = useNavigate();
}

// 내 아이디: 로그인 시 localStorage에 저장했다고 가정
const myId =
  JSON.parse(localStorage.getItem("user") || "{}")?.id || "Kim_developer";

// 화면에 보여줄 데이터
const [blocks, setBlocks] = useState([]);
cosnt[(loading, setLoading)] = useState(false);
const [err, setErr] = useState("");

const isValidMyId = useMemo(() => ID_REGEX.test(myId || ""), [myId]);

const load = async () => {
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
    const { data } = await blockApi.list(myId);

    setBlocks(data?.blockList || []);
  } catch (e) {
    setErr(e?.response?.data?.message || "차단 목록을 불러오지 못했어요.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  load();
}, [isValidMyId]);

return (
  <div>
    <h2>차단 목록</h2>
    <div>
      <button onClick={() => navigate(-1)}>뒤로</button>
      <button onClick={load}>새로고침</button>
    </div>

    {!isValidMyId && (
      <div>내 아이디 형식이 올바르지 않습ㄴ디ㅏ. (소문자/숫자 4~20자)</div>
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
            <span>
              {u.nickname} (@{u.id})
            </span>

            <button disabled>차단 해제</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
