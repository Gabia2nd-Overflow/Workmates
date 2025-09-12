// src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI } from "../services/api"; // 공통 axios 인스턴스 사용
import PostComments from "./PostComments";

export default function PostDetail() {
  const { workshopId, threadId, postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 로그인 유저 정보 가져오기 (localStorage 또는 Context/Redux로 대체 가능)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 게시글 조회
  useEffect(() => {
    if (!workshopId || !threadId || !postId) return;

    let mounted = true;
    setLoading(true);

    postAPI.get(workshopId, threadId, postId)
      .then((res) => {
        if (mounted) setPost(res.data);
      })
      .catch(err => console.error("게시글 조회 오류:", err))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [workshopId, threadId, postId]);

  // 수정 버튼 핸들러
  const handleEdit = async () => {
    if (!post) return;

    const nextTitle = prompt("새 제목을 입력하세요", post.title);
    const nextContent = prompt("새 내용을 입력하세요", post.content);

    if (nextTitle == null && nextContent == null) return;

    const updated = {
      title: nextTitle?.trim() || post.title,
      content: nextContent?.trim() || post.content,
    };

    try {
      const res = await postAPI.update(workshopId, threadId, postId, updated);
      setPost(res.data); // 화면 갱신
      alert("수정 완료!");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  // 삭제 버튼 핸들러 (댓글까지 포함 삭제 시 백엔드 CASCADE 필요)
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글과 댓글을 모두 삭제하시겠습니까?")) return;

    try {
      await postAPI.delete(workshopId, threadId, postId);
      alert("삭제 완료!");
      navigate(`/workshops/${workshopId}/threads/${threadId}`);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류 발생");
    }
  };

  if (loading || !post) return <div className="p-4">로딩 중…</div>;
  return (
    <section className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-500 mb-4">
        작성자: {post.writerNickname || "작성자"} | 작성일:{" "}
        {post.createdAt ? new Date(post.createdAt).toLocaleString("ko-KR") : "-"} | 조회수:{" "}
        {post.views ?? 0}
      </p>

      <div className="border p-4 rounded mb-6 whitespace-pre-wrap">{post.content}</div>

      {/* 작성자 본인만 수정/삭제 버튼 */}
      {post.writerId === user.id && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-yellow-400 text-white rounded"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            삭제
          </button>
        </div>
      )}

      {/* 댓글 컴포넌트 */}
      <PostComments
        workshopId={Number(workshopId)}
        threadId={Number(threadId)}
        postId={Number(postId)}
      />
    </section>
  );
}
