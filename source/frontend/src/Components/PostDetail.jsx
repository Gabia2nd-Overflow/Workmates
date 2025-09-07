// src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postAPI } from "../services/api"; // ✅ 공통 axios 인스턴스 사용

export default function PostDetail() {
  const { workshopId, threadId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!workshopId || !threadId || !postId) return;

    setLoading(true);
    postAPI.get(workshopId, threadId, postId)
    .then((res) => { if (mounted) setPost(res.data); })
    .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [workshopId, threadId, postId]);

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

      {/* 댓글 영역은 추후 Comment API 붙인 뒤 활성화 */}
      {/* <Comments ... /> */}
    </section>
  );
}