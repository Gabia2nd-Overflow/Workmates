import { useState } from "react";
import { blockApi } from "../../services/api";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function UnblockUserButton({
  myId,
  targetId,
  onUnblocked,
  ask = true,
}) {
  const [loading, setLoading] = useState(false);

  const validIds =
    ID_REGEX.test(String(myId || "")) && ID_REGEX.test(String(targetId || ""));

  const disabled = loading || !validIds || myId === targetId;

  const handleClick = async () => {
    if (disabled) return;

    if (ask && !window.confirm(`@${targetId} 사용자의 차단을 해제할까요?`)) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await blockApi.unblockUser(myId, targetId);

      // 서버가 {isUnblocked : true} 면 성공
      if (data?.isUnblocked) {
        alert("차단을 해제했어요.");
        onUnblocked?.(targetId, data); // 부모에 알림 -> 목록 갱신
      } else {
        alert("이미 차단 해제된 사용자이거나 해제할 수 없어요.");
      }
    } catch (e) {
      alert(e?.response?.data?.message || "차단 해제 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      {loading ? "해제중..." : "차단 해제"}
    </button>
  );
}
