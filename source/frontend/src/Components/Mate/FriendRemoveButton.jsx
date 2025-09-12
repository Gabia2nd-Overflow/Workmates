import { useState } from "react";
import { mateApi } from "../../services/api";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

/**
 * 친구 삭제 버튼 (어디서든 재사용)
 * props:
 *  - myId:      요청자 ID (나)
 *  - targetId:  삭제할 친구의 ID
 *  - onRemoved: (선택) 삭제 성공 시 부모에 알려줄 콜백 (targetId, data) => void
 *  - ask:       (선택) confirm 창 띄울지 여부. 기본 true
 */
export default function FriendRemoveButton({
  myId,
  targetId,
  onRemoved,
  ask = true,
}) {
  const [loading, setLoading] = useState(false);

  // 두 ID가 모두 규칙(정규식)에 맞아야 서버 요청 가능
  const validIds =
    ID_REGEX.test(String(myId || "")) && ID_REGEX.test(String(targetId || ""));

  //  버튼을 눌러도 되는지 미리 계산
  //  - 로딩 중엔 비활성
  //  - ID 규칙 어긋나면 비활성
  //  - (의미적) 본인과의 친구 삭제는 보통 존재하지 않지만 안전하게 막아둠
  const disabled = loading || !validIds || myId === targetId;

  const handleClick = async () => {
    if (disabled) return;

    // 정말 삭제할지 한번 더 묻기
    if (
      ask &&
      !window.confirm(`정말 @${targetId}를 친구 목록에서 삭제할까요?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      // POST /api/mate/remove {id, targetId}
      // 응답: {isRemoved : Boolean}
      const { data } = await mateApi.remove(myId, targetId);

      if (data?.isRemoved) {
        alert("친구를 삭제했어요.");
        // 삭제되었다고 부모 컴포넌트에 알려주기 (리스트에서 바로 제거)
        onRemoved?.(targetId, data);
      } else {
        // 서버가 false를 주면: 이미 삭제되었거나 친구 관계가 아닐 수 있음
        alert("이미 삭제되었거나 친구 관계가 아니에요.");
      }
    } catch (e) {
      alert(e?.response?.data?.message || "삭제 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled}>
      {loading ? "삭제중..." : "친구 삭제"}
    </button>
  );
}
