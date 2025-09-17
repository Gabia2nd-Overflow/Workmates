/* eslint-disable no-unused-vars */
// src/pages/PostDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI } from "../services/api";
import PostComments from "./PostComments";

export default function PostDetail() {
  const { workshopId, threadId, postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ 편집 관련 상태
  const [editing, setEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}")); 

  useEffect(() => {
    if (!workshopId || !threadId || !postId) return;
    let mounted = true;
    setLoading(true);

    postAPI
      .get(workshopId, threadId, postId)
      .then((res) => {
        if (!mounted) return;
        setPost(res.data);
      })
      .catch((err) => console.error("게시글 조회 오류:", err))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [workshopId, threadId, postId]);

  // ✅ 편집 모드 진입 (기존 handleEdit 대체: 저장이 아니라 "편집 시작")
  const startEdit = () => {
    if (!post) return;
    setFormTitle(post.title || "");
    setFormContent(post.content || "");
    setEditing(true);

    // 약간의 지연 후 포커스 (렌더 완료 보장)
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  // ✅ 저장
  const saveEdit = async () => {
    if (!post) return;
    if (!formTitle.trim() || !formContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        title: formTitle.trim(),
        content: formContent // 개행 보존
      };
      const res = await postAPI.update(workshopId, threadId, postId, payload);
      setPost(res.data);
      setEditing(false);
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ 취소
  const cancelEdit = () => {
    setEditing(false);
    setFormTitle("");
    setFormContent("");
  };

  // ✅ 삭제
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

  // ✅ 단축키: Ctrl/Cmd + Enter로 저장
  const onContentKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
  };

  if (loading || !post) return <div className="p-4">로딩 중…</div>;

  const isOwner = post.writerId === user.id;

  return (
    <section className="flex-1 p-4">
      {/* 📌 헤더 */}
      {editing ? (
        <input
          ref={titleRef}
          className="w-full border rounded p-2 text-xl font-bold mb-2"
          placeholder="제목"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          maxLength={150}
        />
      ) : (
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      )}

      <p className="text-gray-500 mb-4">
        작성자: {post.writerNickname || "작성자"} | 작성일:{" "}
        {post.createdAt ? new Date(post.createdAt).toLocaleString("ko-KR") : "-"} | 조회수:{" "}
        {post.views ?? 0}
      </p>

      {/* 📌 본문 또는 에디터 */}
      {editing ? (
        <div className="border p-3 rounded mb-4">
          <textarea
            className="w-full min-h-[220px] border rounded p-2"
            placeholder="내용"
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            onKeyDown={onContentKeyDown}
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={saveEdit}
              disabled={saving}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {saving ? "저장 중…" : "저장 (Ctrl/Cmd+Enter)"}
            </button>
            <button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="border p-4 rounded mb-6 whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* 📌 작성자만 수정/삭제 */}
      {isOwner && !editing && (
        <div className="mb-4 flex gap-2">
          <button onClick={startEdit} className="px-3 py-1 bg-yellow-400 text-white rounded">
            수정
          </button>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">
            삭제
          </button>
        </div>
      )}

      {/* 📌 댓글 */}
      <PostComments
        workshopId={Number(workshopId)}
        threadId={Number(threadId)}
        postId={Number(postId)}
      />
    </section>
  );
}