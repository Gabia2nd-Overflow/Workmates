# 📌 Workmates - Workshop 기능 요약

## ✅ 개요
워크샵(Workshop)은 협업 메신저의 **최상위 서버 단위 공간**으로, 사용자가 생성하고 참여하여 협업을 진행하는 구조입니다.  
해당 기능은 Spring Boot + JPA 기반으로 **Controller → Service → Repository → Entity** 계층형 아키텍처를 따릅니다:contentReference[oaicite:0]{index=0}.

---

## 📦 도메인 설계

### Workshop (Entity)
- `id`: 워크샵 식별자 (PK)
- `name`: 워크샵 이름 (Unique, Not Null)
- `imageUrl`: 워크샵 아이콘 이미지 (nullable)
- `description`: 워크샵 설명 (nullable)
- `isDeleted`: 삭제 여부 (Soft Delete, 기본값 false)

---

## 🛠 Repository
`WorkshopRepository extends JpaRepository<Workshop, Long>`  
- `findAllByIsDeletedFalse()` → 삭제되지 않은 워크샵 목록 조회  
- `findByIdAndIsDeletedFalse(Long id)` → 특정 워크샵 상세 조회  
- `existsByIdAndIsDeletedFalse(Long id)` → 존재 여부 확인  

---

## ⚙️ Service
`WorkshopService`에서 비즈니스 로직 담당  
- **create(req)**: 새 워크샵 생성 후 저장  
- **list()**: 삭제되지 않은 워크샵 전체 조회  
- **get(id)**: ID로 워크샵 조회 (미존재 시 예외 발생)  
- **update(id, req)**: 이름/아이콘/설명 수정 (더티체킹)  
- **softDelete(id)**: `isDeleted`를 true로 변경하여 논리적 삭제  

---

## 🎛 Controller
REST API 제공 (`/api/workshops`)  
- `POST /api/workshops` → 워크샵 생성  
- `GET /api/workshops` → 워크샵 목록 조회  
- `GET /api/workshops/{id}` → 특정 워크샵 조회  
- `PATCH /api/workshops/{id}` → 워크샵 정보 수정  
- `DELETE /api/workshops/{id}` → 워크샵 소프트 삭제  

---

## 📑 DTO 구조
중첩 클래스 패턴으로 요청/응답 DTO 정의  
- `CreateRequest`: 이름, 아이콘, 설명 입력  
- `UpdateRequest`: 수정용 데이터  
- `Response`: id, name, icon, description, isDeleted 반환  
  - `Response.from(Workshop w)` → Entity → DTO 변환  

---

## 🔁 데이터 흐름 요약
1. 클라이언트 요청 → Controller (`@RestController`) 수신  
2. Service에서 로직 처리 및 Repository 호출  
3. Workshop Entity DB 저장/조회  
4. DTO 변환 후 응답 반환  

---

## 📌 정리
본 워크샵 모듈은 **생성, 조회, 수정, 삭제(Soft Delete)**를 지원하는 기본 CRUD 구조로 설계됨.  
향후 워크샵 내 채팅방·스레드 등 하위 기능과 연계되어, **프로젝트 협업의 최상위 단위 공간** 역할을 담당합니다.
