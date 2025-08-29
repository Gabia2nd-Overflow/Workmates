import { useRef } from 'react';
import { fileAPI } from '../services/api';

const FileUploadButton = ({ chatroomId, userId, stompClient }) => {
  const inputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fileAPI.upload(formData);
      const fileData = res.data;

      // WebSocket으로 파일 메시지 전송
      stompClient.current.publish({
        destination: '/pub/chat.send',
        body: JSON.stringify({
          chatroomId,
          senderId: userId,
          content: "파일 업로드가 완료되었습니다.",
          fileUrl: fileData.fileUrl,
          fileName: fileData.fileName,
          type: 'FILE',
        }),
      });

      console.log('✅ 파일 업로드 및 전송 성공');
    } catch (err) {
      console.error('❌ 파일 업로드 실패', err);
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => inputRef.current.click()} 
        className="file-upload-btn">
        📎
      </button>

      <input
        type="file"
        ref={inputRef}
        className="file-input-hidden"
        onChange={handleUpload}
      />
    </>
  );
};

export default FileUploadButton;
