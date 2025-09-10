/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { mateApi } from "../../services/api";
import FriendAddButton from "./FriendAddButton";

// 가이드 정규식 : 소문자/숫자 4~20자
const ID_REGEX = /^[a-z0-9]{4,20}$/;

export default function MateSearchBox({ myId }) {
  // 입력창에 적은 값
  const [value, setValue] = useState("");

  // 서버에 물어보는 중인지(로딩 표시용)
  const [loading, setLoading] = useState(false);

  // 검색해서 나온 결과(있으면 { id, nickname, imageUrl }, 없으면 null)
  const [result, setResult] = useState(null);

  // 검색했는데 “없는 사람”일 때 true (백엔드가 400으로 알려줌)
  const [notFound, setNotFound] = useState(false);

  // 입력값이 정규식을 통과하는지 (맞으면 true, 아니면 false)
  const isValid = useMemo(() => ID_REGEX.test(value), [value]);

  //검색 버튼 눌렀을 때
  const onSearch = async () => {
    // 공백 제거 + 소문자로 통일 (소문자/숫자만 허용)
    const v = value.trim().toLowerCase();

    // 정규식 통과 X -> 서버에 물어보지않고 바로 중단
    if (!ID_REGEX.test(v)) {
      setResult(null);
      setNotFound(false);
      return;
    }

    // 정규식 통과 O -> 서버에 물어봄
    setLoading(true);
    setResult(null); // 이전 결과 비우기
    setNotFound(false); // "없음" 표시도 끄기
    try {
      // POST /api/mate/search {id}
      const res = await mateApi.search(v);

      // 성공: { id, nickname, imageUrl }를 돌려줌
      setResult(res.data);
    } catch (e) {
      // 실패 중에서도 “없는 사람”은 백엔드가 400으로 알려줌 → notFound=true
      if (e?.response?.status === 400) setNotFound(true);
      else alert(e?.response?.data?.message || "검색 실패");
    } finally {
      setLoading(false);
    }
  };

  // 친구 추가 버튼 눌렀을 때
  const onAppend = async () => {
    if (!result?.id) return;

    // 본인은 추가 못하게
    if (myId && result.id === myId) {
      alert("본인은 추가할 수 없어요.");
      return;
    }

    try {
      // POST /api/mate/append {senderId, receiverId}
      const res = await mateApi.append(myId, result.id);
      // 백엔드가 inviteSent=true면 “요청을 보냈다” 의미
    } catch (e) {
      alert(e?.response?.data?.message || "요청 실패");
    }
  };

  return (
    <div>
      {/* 입력창 + 검색 버튼 */}
      <div>
        <input
          placeholder="아이디(소문자/숫자 4~20자"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
          onKeyDown={(e) => e.key === "Enter" && !loading && onSearch()}
        />
        <button onClick={onSearch} disabled={loading || !value}>
          {loading ? "검색중..." : "검색"}
        </button>
      </div>

      {/* 정규식 통과 못하면 문구 보여주기 */}
      {value && isValid && (
        <div>아이디 형식이 올바르지 않습니다. (소문자/숫자 4~20자)</div>
      )}

      {/* 백엔드가 400으로 없다고 알려준 경우 */}
      {notFound && <div>검색 결과가 없습니다.</div>}

      {/* 결과가 있는 경우 : 정보 보여주고, 친구 추가 버튼 제공 */}
      {result && (
        <div>
          <div>ID: {result.id}</div>
          <div>닉네임: {result.nickname}</div>
          <div>이미지: {result.imageUrl}</div>

          {/* senderId, receiverId 보내기 + 이미 친구면 버튼 비활성 */}
          <FriendAddButton
            myId={myId} // 요청자
            targetId={result.id} //피요청자
            friends={friends} //이미 친구 리스트
            onDone={() => {
              // 입력/결과 초기화
              setValue("");
              setResult(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
