Workmates — LlamaIndex 요약 (A4 1장)
1) 한 줄 정의

LlamaIndex = 내 문서·대화 데이터를 LLM이 잘 찾고(검색) 이해해 답하게(생성) 만드는 RAG 프레임워크.
문서/메시지 로드 → 조각화(chunk) → 임베딩 색인 → 메타데이터 필터로 검색 → LLM이 근거와 함께 요약/답변.

2) 핵심 역할

수집(Load): DB, 파일(PDF/Docx), API 등에서 텍스트/메타데이터를 가져옴.

파싱/조각화(Parse/Chunk): LLM이 다루기 좋게 문서를 작은 노드로 분할.

색인(Index): 벡터DB(Chroma/pgvector 등)에 임베딩 저장.

검색(Retrieve): 질문과 유사도가 높은 노드만 뽑아냄(+BM25, rerank 옵션).

질의(Query Engine): 검색된 컨텍스트를 LLM에 붙여 정확한 요약/답변 생성.

필터링(Metadata): workshopId, threadId, type 등으로 검색 범위 제한.

3) 우리 프로젝트에 “어떻게” 쓰나 (Workshop 스코프 RAG)

목표: “각 워크샵별 Post·라운지 메시지·댓글·첨부만” 검색/요약.

방법: 인덱싱/질의 모두에 workshopId 필수 메타를 사용하고, 요청 시 항상 필터를 건다.

권한: Spring(JWT, 멤버십)이 검사 → 통과한 요청만 AI서비스(LlamaIndex)로 프록시.

4) 메타데이터 스키마(권장)

모든 노드(조각)에 공통으로 붙임:

{
  "workshopId": 101,             // ★ 필수: 워크샵 경계
  "threadId": 12,                // 스레드/게시판(옵션)
  "loungeId": 9,                 // 채팅(옵션)
  "postId": 345,                 // 포스트/댓글(옵션)
  "type": "post|comment|chat|file",
  "filename": "Spec_v2.pdf",
  "uploaderId": "alice",
  "createdAt": "2025-09-08T12:00:00"
}


질의 시: filters = { workshopId: X } (+ 필요시 threadId, type).

5) 최소 아키텍처
React(질문 UI)
  → Spring /api/ai/query  (JWT로 권한 검증)
    → AI-service(FastAPI + LlamaIndex)
        /ingest : 문서/텍스트를 색인(메타 포함)
        /query  : 필터링 검색 + 요약
      └ Vector DB(Chroma/pgvector), Object Storage(S3/MinIO)

6) 최소 API 계약(예시)

Ingest (Spring이 생성/업로드 트리거 후 호출)

POST /ingest
{
  "workshopId": 101, "threadId": 12,
  "type": "post|comment|chat|file",
  "text": "본문 또는 추출 텍스트",
  "filename": "spec.pdf", "uploaderId": "alice", "createdAt": "..."
}
→ 200 { "status": "ok" }


Query (프론트→Spring→AI-service)

POST /query
{
  "workshopId": 101,
  "threadId": 12,          // 옵션
  "query": "JWT 수정/삭제 흐름 요약해줘",
  "top_k": 5, "with_rerank": true
}
→ 200 { "answer": "...", "citations": [{ "filename":"...", "snippet":"..." }] }

7) MVP 실행 순서(빠르게)

AI-service 구축: FastAPI + LlamaIndex + Chroma(로컬) 컨테이너.

/ingest 연결: Post/Comment 저장, 파일 업로드 성공 시 텍스트 추출→/ingest 호출(메타 포함).

/api/ai/query 프록시: Spring에서 JWT 멤버십 검증 후 /query 호출.

Thread 화면 “Ask AI”: 검색창 1개 + 답변/근거 렌더링.

이후: pgvector 전환, PDF 고급 파싱(LlamaParse), reranker, “하루 요약” 자동화.

8) 품질·운영 체크포인트

권한 경계: 필수 — Spring에서 워크샵 멤버십 검증 후 workshopId 필터 강제.

데이터 품질: 첨부는 OCR/파서 품질이 정확도 좌우 → 필요 시 LlamaParse.

중복/증분 인덱싱: fileHash+workshopId 키로 업서트, 실패 재시도 큐.

감사로그: 질문·응답·근거를 DB에 기록(추적/개선용).

9) 만들 수 있는 기능

워크샵 전용 통합 검색: Post/댓글/채팅/첨부 한 번에 찾기.

요약 리포트: “오늘/이번 주” 스레드/파일 요약.

첨부 Q&A: PDF 사양서·회의록에 직접 질의(근거 하이라이트).

10) 결론

LlamaIndex는 **워크샵 경계 내 자료를 “빠르게 찾고 정확하게 요약”**하도록 해주는 RAG 프레임워크.

우리 구조(Workshop→Thread→Post/Comment/Chat/File)와 메타데이터 필터만 잘 맞추면 즉시 실용적인 검색·요약이 가능하다.