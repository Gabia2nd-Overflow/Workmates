import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ThreadDetail() {
  const { threadId, workshopId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/threads/${threadId}/posts`);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("게시글 목록 로드 오류:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    if (threadId) fetchPosts();
  }, [threadId]);

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:8080/api/threads/${threadId}/posts`,
        { title: postTitle, content: postContent, category: "일반" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => [...prev, data]);
      setPostTitle("");
      setPostContent("");
      setCreatingPost(false);
    } catch (err) {
      console.error("게시글 생성 오류:", err);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      // 조회수 증가 시도
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/views`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 로컬 상태 업데이트
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );
    } catch (err) {
      console.warn("조회수 증가 실패:", err);
    } finally {
      // 실패해도 상세 페이지 이동
      navigate(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`);
    }
  };

  const displayedPosts = posts
    .filter(p =>
      p.title.includes(searchTerm) ||
      p.content.includes(searchTerm) ||
      p.writerNickname?.includes(searchTerm)
    )
    .sort((a, b) => {
      let valA = sortKey === "createdAt" ? new Date(a[sortKey]) : a[sortKey] || 0;
      let valB = sortKey === "createdAt" ? new Date(b[sortKey]) : b[sortKey] || 0;
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <section className="flex-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-xl text-pink-400">게시판 #{threadId}</h2>
        <button
          className="px-3 py-1 bg-pink-500 text-white rounded"
          onClick={() => setCreatingPost(v => !v)}
        >
          + 새 글 작성
        </button>
      </div>

      {creatingPost && (
        <form onSubmit={createPost} className="mb-4 flex flex-col gap-2">
          <input
            className="border p-2 rounded"
            placeholder="제목"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            required
          />
          <textarea
            className="border p-2 rounded"
            placeholder="내용"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={4}
            required
          />
          <button className="px-3 py-1 bg-pink-400 text-white rounded">작성</button>
        </form>
      )}

      <div className="flex items-center justify-between mb-2 gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="검색어 입력..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="createdAt">작성일</option>
          <option value="views">조회수</option>
          <option value="replyCount">댓글 수</option>
        </select>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "오름차순" : "내림차순"}
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-pink-100 text-pink-600">
            <th className="border px-3 py-2">번호</th>
            <th className="border px-3 py-2">제목</th>
            <th className="border px-3 py-2">작성자</th>
            <th className="border px-3 py-2">작성일</th>
            <th className="border px-3 py-2">조회수</th>
            <th className="border px-3 py-2">댓글 수</th>
            <th className="border px-3 py-2">분류</th>
          </tr>
        </thead>
        <tbody>
          {displayedPosts.map((post, idx) => (
            <tr
              key={post.id}
              className="hover:bg-pink-50 cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <td className="border px-3 py-2 text-center">{idx + 1}</td>
              <td className="border px-3 py-2">{post.title}</td>
              <td className="border px-3 py-2 text-center">{post.writerNickname || "작성자"}</td>
              <td className="border px-3 py-2 text-center">{post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}</td>
              <td className="border px-3 py-2 text-center">{post.views || 0}</td>
              <td className="border px-3 py-2 text-center">{post.replyCount || 0}</td>
              <td className="border px-3 py-2 text-center">{post.category || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
