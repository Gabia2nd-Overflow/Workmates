import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import jwt_decode from "jwt-decode";

export default function ThreadDetail() {
  const { threadId } = useParams();
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  
  

//   const authorName = post.author ? jwt_decode(post.author).sub : "작성자";
  // 게시글 불러오기
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

  // 새 글 작성
  const createPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT
      const { data } = await axios.post(
        `http://localhost:8080/api/threads/${threadId}/posts`,
        {
          title: postTitle,
          content: postContent,
          category: "일반"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPosts((prev) => [...prev, data]);
      setPostTitle("");
      setPostContent("");
      setCreatingPost(false);
    } catch (err) {
      console.error("게시글 생성 오류:", err);
    }
  };

  

  return (
    <section className="flex-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-xl text-pink-400">게시판 #{threadId}</h2>
        <button
          className="px-3 py-1 bg-pink-500 text-white rounded"
          onClick={() => setCreatingPost((v) => !v)}
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

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-pink-100 text-pink-600">
            <th className="border px-3 py-2">번호</th>
            <th className="border px-3 py-2">제목</th>
            <th className="border px-3 py-2">작성자</th>
            <th className="border px-3 py-2">작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id} className="hover:bg-pink-50">
              <td className="border px-3 py-2 text-center">{index + 1}</td>
              <td className="border px-3 py-2">{post.title}</td>
              <td className="border px-3 py-2 text-center">{post.writerNickname || "작성자"}</td>
              <td className="border px-3 py-2 text-center">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  
}

