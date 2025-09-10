// src/pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { postAPI } from "../services/api"; // ✅ 공통 axios 인스턴스 사용
import PostComments from "./PostComments";
import { useNavigate } from "react-router-dom";


export default function PostDetail() {
  const { workshopId, threadId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  


  // 수정 버튼 핸들러
  const handleEdit = async () => {
  try {
    const updated = {
      title: prompt("새 제목을 입력하세요", post.title) || post.title,
      content: prompt("새 내용을 입력하세요", post.content) || post.content,
    };

    const res = await postAPI.update(workshopId, threadId, postId, updated);
    alert("수정 완료!");
    setPost(res.data); // 화면 갱신
  } catch (err) {
    console.error("수정 실패:", err);
    alert("수정 중 오류 발생");
  }
};

  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await postAPI.delete(workshopId, threadId, postId);
      alert("삭제되었습니다.");
      navigate(`/workshops/${workshopId}/threads/${threadId}`);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

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

      
      {/*수정*/}
      
<button
  onClick={handleEdit}
  className="px-3 py-1 mr-2 bg-red-200 text-white rounded"
>
  수정
</button>

{/*삭제*/}
<button
  onClick={handleDelete}
  className="px-3 py-1 bg-red-400 text-white rounded"
>
  삭제
</button>


    
      <PostComments
        workshopId={Number(workshopId)}
        threadId={Number(threadId)}
        postId={Number(postId)}
      />
    </section>
  );
}