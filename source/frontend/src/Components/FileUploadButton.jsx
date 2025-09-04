import { useRef } from "react";
import { useParams } from "react-router-dom";
import { fileAPI, messageAPI } from "../services/api";

const FileUploadButton = ({ userId, stompClient, messageId: propMessageId }) => {
  const inputRef = useRef();
  const { workshopId, loungeId } = useParams(); // /workshops/:workshopId/lounges/:loungeId

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let messageId = propMessageId;

      // ✅ 메시지 ID가 없다면, 임시 메시지를 먼저 하나 만들고(아이디 확보)
      if (!messageId) {
        // 현재 백엔드 DTO가 writerId를 요구한다면 포함, 토큰 기반으로 바꿨다면 content만 보내세요.
        const payload = { writerId: userId, content: "(파일 첨부 예정)" };
        const { data: created } = await messageAPI.create(workshopId, loungeId, payload);
        messageId = created.id;
      }

      // ✅ 파일 업로드 + 해당 메시지에 귀속
      const { data } = await fileAPI.uploadToMessage(workshopId, loungeId, messageId, file);
      const fileUrl = data?.fileUrl;

      // (선택) 소켓 브로드캐스트까지 하고 싶다면 서버 쪽에서 broadcastService 호출을 추가하거나,
      // 아래처럼 소켓으로 '업데이트' 알림을 쏘세요.
      if (stompClient?.current && workshopId && loungeId) {
        stompClient.current.publish({
          destination: `/pub/workshops.${workshopId}.lounges.${loungeId}.send`,
          body: JSON.stringify({
            writerId: userId,                 // (토큰 기반으로 바꿨다면 제거 가능)
            content: `파일 첨부: ${fileUrl}`, // UI 표시용
          }),
        });
      }

      console.log("✅ 파일 업로드 및 바인딩 성공", fileUrl);
    } catch (err) {
      console.error("❌ 파일 업로드 실패", err);
    } finally {
      e.target.value = ""; // 같은 파일 재업로드 대비 초기화
    }
  };

  return (
    <>
      <button type="button" onClick={() => inputRef.current.click()} className="file-upload-btn">
        📎
      </button>
      <input type="file" ref={inputRef} className="file-input-hidden" onChange={handleUpload} />
    </>
  );
};

export default FileUploadButton;