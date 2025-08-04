# 📁 Workmates - 파일 업로드 기능 요약 (A4 1장)

## ✅ 시스템 개요

- 사용자가 채팅창에서 📎 버튼으로 파일을 선택하면
- 파일은 서버의 `/uploads` 폴더에 저장되고
- `fileUrl`, `fileName` 정보를 WebSocket으로 전송하여
- 채팅창에 “📎 파일 업로드가 완료되었습니다.” 메시지로 출력되는 구조

---

## ✅ 프론트엔드 흐름 (React)

1. `<FileUploadButton />` 컴포넌트에서 파일 선택
2. `axios.post("/api/messages/files")`로 파일 업로드
3. 응답받은 `fileUrl`, `fileName`을 포함해 WebSocket 메시지 전송

```js
{
  chatroomId,
  senderId,
  type: "FILE",
  content: "파일 업로드가 완료되었습니다.",
  fileUrl: "/files/uuid_파일.png",
  fileName: "스크린샷.png"
}
```

4. `ChatroomDetail.jsx`에서 메시지 `type`에 따라 파일 메시지 렌더링

---

## ✅ 백엔드 흐름 (Spring Boot)

- 파일 업로드 API: `POST /api/messages/files`
- 컨트롤러: `MessageFileController`
- 저장 경로: `System.getProperty("user.dir") + "/uploads"`
- 응답 DTO: `fileUrl`, `fileName`

```java
file.transferTo(Paths.get(uploadDir, uuid).toFile());
```

- WebSocket 메시지 DTO에는 `type`, `fileUrl`, `fileName` 포함됨

---

## ✅ WebMvcConfig 설정

정적 경로로 업로드된 파일에 접근 가능하도록 설정

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/files/**")
            .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
  }
}
```

---

## ✅ 요약

| 항목 | 내용 |
|------|------|
| 저장 위치 | backend/uploads (루트 기준) |
| 접근 경로 | http://localhost:8080/files/파일명 |
| 클라이언트 역할 | 파일 선택 → 업로드 → WebSocket 전송 |
| 서버 역할 | 파일 저장 + fileUrl 응답 + nickname 포함 전송 |
| 출력 결과 | “📎 파일 업로드가 완료되었습니다.” + 다운로드 링크
