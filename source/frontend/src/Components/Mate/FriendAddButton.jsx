// 친구 추가 전용 버튼 (검색 결과 카드나 사용자 리스트 어디서나 재사용 가능)
import { mateApi } from "../../services/api";

const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function FriendAddButton({
  myId, // 요청자 (나의) 아이디 = senderId
  targetId, // 상대방 아이디 = receiverId
  friends = [], // 이미 친구인 사람들 배열 [{ id, nickname, ... }]
  onDone, // (옵션) 성공/실패 후 부모에게 알려줄 콜백
}) {
  // 이미 친구인지 확인
  const alreadyFriend = friends.some((f) => f.id === targetId);

  // 2) 버튼을 눌러도 되는지 미리 계산
  //   - 규칙 어긋나면 안 됨 (정규식)
  //   - 본인은 추가 불가 (myId === targetId)
  //   - 이미 친구면 버튼 비활성화
  const disabled =
    !ID_REGEX.test(String(myId || "")) ||
    !ID_REGEX.test(String(targetId || "")) ||
    myId === targetId ||
    alreadyFriend;

  // 3) 버튼에 보여줄 글자 정하기
  //   - 이미 친구면 "이미 친구"
  //   - 본인이면 "본인"
  //   - 그 외엔 "친구 추가"
  const label = alreadyFriend
    ? "이미 친구"
    : myId === targetId
      ? "본인"
      : "친구 추가";

  // 4) 실제로 버튼을 눌렀을 때 동작
  const onClick = async () => {
    // 비활성 상태(disabled === true)면 눌러도 아무 일 안 함
    if (disabled) return;

    try {
      // POST /api/mate/append
      // body: { senderId: myId, receiverId: targetId }
      // 응답: { inviteSent: Boolean }
      const { data } = await mateApi.append(myId, targetId);

      // 백엔드가 inviteSent=true 라면 "정상적으로 요청을 보냄"이라는 뜻
      // false 라면 "이미 요청을 보냈거나 이미 친구 상태" 같은 상황일 수 있음
      alert(
        data.inviteSent ? "친구 요청 보냈어요!" : "이미 요청/친구 상태에요."
      );

      // 부모에게 알려주고 싶다면 여기서 콜백 호출
      onDone?.(null, data);
    } catch (e) {
      // 네트워크/서버 오류 메시지 우선 사용, 없으면 "요청 실패"
      alert(e?.response?.data?.message || "요청 실패");
      onDone?.(e);
    }
  };

  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
