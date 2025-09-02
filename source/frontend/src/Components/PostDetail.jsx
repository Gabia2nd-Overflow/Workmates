import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 게시글 불러오기
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/posts/${postId}`);
      setPost(data);
    } catch (err) {
      console.error("게시글 로드 오류:", err);
    }
  };

  // 댓글 불러오기
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("댓글 로드 오류:", err);
      setComments([]);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  // 새 댓글 작성
  const createComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:8080/api/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <section className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-500 mb-4">
        작성자: {post.writerNickname || "작성자"} | 작성일: {new Date(post.createdAt).toLocaleDateString("ko-KR")} | 조회수: {post.views || 0}
      </p>
      <div className="border p-4 rounded mb-6 whitespace-pre-wrap">{post.content}</div>

      {/* 댓글 목록 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">댓글 ({comments.length})</h3>
        {comments.length === 0 && <p className="text-gray-400">등록된 댓글이 없습니다.</p>}
        {comments.map(comment => (
          <div key={comment.id} className="border-b py-2">
            <p className="text-sm text-gray-700">{comment.writerNickname || "익명"}: {comment.content}</p>
            <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString("ko-KR")}</p>
          </div>
        ))}
      </div>

      {/* 새 댓글 작성 */}
      <form onSubmit={createComment} className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="댓글 작성..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button className="px-3 py-1 bg-pink-500 text-white rounded">등록</button>
      </form>
    </section>
  );
}
