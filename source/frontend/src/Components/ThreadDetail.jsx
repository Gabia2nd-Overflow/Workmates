import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI, threadAPI } from "../services/api";
import FileUploadButton from "./FileUploadButton";

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
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10); // 한 화면에 보여줄 게시글 수
  const [threadName, setThreadName] = useState("");

  

  const fetchThreadName = async () => {
    try {
      const { data } = await threadAPI.get(workshopId, threadId);
      setThreadName(data.name || "이름없음");
    }
    catch (err) {
      console.error("스레드 이름 로드 오류:", err);
      setThreadName("이름없음");
    }
  };
  useEffect(() => {
    if (threadId) fetchThreadName();
  }, [threadId]);
  
  // 게시글 목록 조회
  const fetchPosts = async () => {
    try {
      const { data } = await postAPI.list(workshopId, threadId, { sort: "createdAt" });
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("게시글 목록 로드 오류:", err);
      setPosts([]);
    }
  };




  useEffect(() => {
    if (threadId) fetchPosts();
  }, [threadId]);

  // 게시글 생성
  const createPost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await postAPI.create(workshopId, threadId, {
        title: postTitle,
        content: postContent,
        category: "일반",
        threadId: Number(threadId),
      });

      setPosts((prev) => [...prev, data]);
      setPostTitle("");
      setPostContent("");
      setCreatingPost(false);
    } catch (err) {
      console.error("게시글 생성 오류:", err);
      if (err.response?.status === 403) alert("로그인이 필요합니다.");
    }
  };

  // 게시글 클릭 시 조회수 증가 후 상세 페이지 이동
  const handlePostClick = async (postId) => {
    try {
      await postAPI.increaseViews(workshopId, threadId, postId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, views: (post.views || 0) + 1 } : post
        )
      );
    } catch (err) {
      console.warn("조회수 증가 실패:", err);
    } finally {
      navigate(`/workshops/${workshopId}/threads/${threadId}/posts/${postId}`);
    }
  };

  // 검색 + 정렬 후 페이지네이션 적용
  const filteredAndSorted = posts
    .filter(
      (p) =>
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

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredAndSorted.slice(startIndex, endIndex);
  

  return (
    <section className="flex-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-xl text-pink-400">{threadName||"로딩중.."}</h2>
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

    {/* 파일 업로드 버튼 */}
    <FileUploadButton
      workshopId={workshopId}
      threadId={threadId}
      onUpload={(fileUrl) => {
        setPostContent((prev) => prev + `\n${fileUrl}`);
      }}
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
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
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
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, idx) => (
            <tr
              key={post.id}
              className="hover:bg-pink-50 cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <td className="border px-3 py-2 text-center">{page * pageSize + idx + 1}</td>
              <td className="border px-3 py-2">{post.title}</td>
              <td className="border px-3 py-2 text-center">{post.writerNickname || "작성자"}</td>
              <td className="border px-3 py-2 text-center">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("ko-KR") : "-"}
              </td>
              <td className="border px-3 py-2 text-center">{post.views || 0}</td>
              <td className="border px-3 py-2 text-center">{post.replyCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

       {/* 페이지 번호 네모박스 */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 border rounded ${
              i === page ? "bg-pink-500 text-white" : "bg-white text-pink-500"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
    </section>
  );
}
