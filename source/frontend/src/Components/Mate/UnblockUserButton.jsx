import { useMemo, useState } from "react";
import { blockApi } from "../../services/api";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function UnblockUserButton({
  myId,
  targetId,
  onUnblocked,
  ask = true,
}) {
  const [loading, setLoading] = useState(false);

  const valid = useMemo(
    () =>
      ID_REGEX.test(String(myId || "")) &&
      ID_REGEX.test(String(targetId || "")) &&
      myId !== targetId,
    [myId, targetId]
  );

  // 버튼 비활성화 조건
  const disabled = loading || !valid;

  const handleClick = async () => {
    if (disabled) return;

    if (ask && !window.confirm(`@${targetId} 사용자의 차단을 해제할까요?`)) {
      return;
    }

    try {
      setLoading(true);

      const res = await blockApi.unblockUser(myId, targetId);
      const data = res?.data;

      // 서버가 204(No Content)를 주거나, 다양한 성공 키를 주는 경우 모두 성공 처리
      const ok =
        res?.status === 204 ||
        data?.isUnblocked === true ||
        data?.unblocked === true ||
        data?.success === true ||
        data?.ok === true;

      if (ok) {
        alert("차단을 해제했어요.");
        onUnblocked?.(targetId, data); // 부모에 알림 -> 목록 갱신
      } else {
        alert(
          data?.message || "이미 차단 해제된 사용자이거나 해제할 수 없어요."
        );
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
