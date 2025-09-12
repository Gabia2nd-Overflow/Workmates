/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { blockApi } from "../../services/api";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function BlockUserButton({
  myId,
  targetId,
  onBlocked, // 차단 성공 시 부모에게 알려줄 콜백 (targetId, data) => void
  ask = true, // confirm()으로 한번 더 묻기 (기본 true)
}) {
  // 버튼을 눌러 서버에 요청하는 동안 true -> 중복 클릭 방지 및 "차단중..." 표시
  const [loading, setLoading] = useState(false);

  const validIds =
    ID_REGEX.test(String(myId || "")) && ID_REGEX.test(String(targetId || ""));

  // 버튼 비활성 조건 (로딩 중, 아이디 규칙 위반, 본인 차단)
  const disabled = loading || !validIds || myId === targetId;

  const handleClick = async () => {
    if (disabled) return;

    if (ask && !window.confirm(`정말 @${targetId} 사용자를 차단할까요?`)) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await blockApi.blockUser(myId, targetId);

      if (data?.isBlocked) {
        alert("사용자를 차단했어요.");
        onBlocked?.(targetId, data);
      } else {
        alert("이미 차단되었거나 차단할 수 없어요.");
      }
    } catch (e) {
      alert(e?.response?.data?.message || "차단 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      {loading ? "차단중..." : "사용자 차단"}
    </button>
  );
}
