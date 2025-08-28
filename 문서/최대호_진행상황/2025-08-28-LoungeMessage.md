이번 프로젝트는 초기 단순 Chatroom 중심 메신저 구조에서, 협업툴로 확장 가능한 Workshop(서버) → Lounge(채팅방) → 메시지·파일 기능 구조로 개편한 과정이다. 기존 구조는 채팅방 단위만 존재하여 협업 시 상위 그룹화가 불가능했고, 확장성·권한 관리·파일 기능 통합에 제약이 있었다. 따라서 Discord와 유사하게 “서버(Workshop)” 단위를 최상위로 두고, 그 안에 다수의 “라운지(Lounge)”가 속하며, 각 라운지 내부에서 메시지와 파일 업로드/다운로드/삭제 기능을 제공하는 계층적 구조로 변경했다. 이 변경은 단순 메시징을 넘어 협업 공간을 제공하기 위한 핵심 의도였다.

API 주소 개편

백엔드 API는 기존 api/chatrooms 기반에서 워크샵 기반 계층형 주소로 변경되었다. 즉, api/workshops/{workshopId}/lounges/{loungeId}/messages 형태로 RESTful 규칙을 따르게 되었으며, 이를 통해 요청이 어느 워크샵과 라운지에 속하는지 명확히 표현된다. 이는 DB 스키마와 서비스 계층에서 Workshop–Lounge 종속성을 일관성 있게 반영하는 데 필요했다.

프론트엔드 라우팅 및 컴포넌트

React 라우팅도 계층형으로 재설계하였다. Sidebar는 Workshop 목록을 보여주고, 클릭 시 /workshops/:id로 이동해 WorkshopDetail 페이지가 열리며, 여기에서 해당 워크샵의 라운지 목록을 관리한다. 각 라운지 클릭 시 /workshops/:id/lounges/:loungeId로 이동하여 LoungeDetail이 열리고, 메시지 목록, WebSocket 기반 실시간 전송, 파일 업/다운/삭제 기능이 포함된다. 이로써 “워크샵 선택 → 라운지 선택 → 대화 및 파일 협업”의 흐름이 완성되었다.

시행착오와 해결 과정

User 엔티티 id 충돌: JPA에서 자동생성 id와 사용자 계정 id를 혼동, 계정 id를 직접 primary key로 확정하고 DTO/프론트를 맞춤.

MessageDto 혼란: REST용과 WebSocket용 DTO가 뒤섞여 에러 발생 → 전송 방식에 따라 구분(REST 초기 로딩 = MessageResponse, 실시간 브로드캐스트 = ChatSocketResponse).

WebSocket 브로드캐스트 시그니처 오류: sendDeleted 인자 개수 불일치 → sendDeleted(workshopId, loungeId, messageId)로 통일.

프론트 SignUp/Login: username→id 전환 시 confirmPassword 처리 혼란 → confirmPassword는 검증용으로만 유지, API 전송 제외.

UI 문제: Sidebar 버튼이 Header에 가려짐 → z-index 및 padding 조정.

React key 경고: 메시지 중복 렌더링 문제 → key를 id+updatedAt 조합으로 해결.

현재 결과와 확장 방향

현재까지 회원가입/로그인, Workshop 생성, Lounge 생성, 메시지 전송/수정/삭제, 파일 업로드까지 한 사이클이 구축되었고, WebSocket 실시간 통신과 DB 연동도 정상 동작한다. 앞으로는 권한 관리(워크샵 초대/추방), 알림/읽음 표시, 파일 스토리지 연동(S3), 테스트 코드 및 배포 자동화를 추가할 예정이다. 즉, 현재 구조는 워크샵–라운지–메시지 계층을 기반으로 확장 가능한 협업 메신저의 초석을 마련했다.