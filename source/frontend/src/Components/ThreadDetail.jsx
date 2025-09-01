import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {postAPI} from "../services/api";

export default function ThreadDetail() {
  const { threadId } = useParams();
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    // threadId가 유효한지 확인하고 API 호출
    if (threadId) {
      postAPI.list(threadId)
        .then((res) => {
          setPosts(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("게시글 목록 로드 오류:", err);
          setPosts([]);
        });
    } else {
      console.warn("threadId가 정의되지 않았습니다. API 호출을 건너뜁니다.");
      setPosts([]);
    }
  }, [threadId]);

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await postAPI.create(threadId, { title: postTitle, content: postContent });
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
        <h2 className="font-bold text-xl">게시판</h2>
        <button className="px-3 py-1 bg-black text-white rounded" onClick={() => setCreatingPost((v) => !v)}>+ 새 글</button>
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
          <button className="px-3 py-1 bg-black text-white rounded">작성</button>
        </form>
      )}

      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded hover:bg-gray-100">
            <h3 className="font-bold">{post.title}</h3>
            <p className="text-gray-700">{post.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}