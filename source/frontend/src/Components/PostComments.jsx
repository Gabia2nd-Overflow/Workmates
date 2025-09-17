import { useEffect, useState, useCallback, useRef } from "react";
import { commentAPI } from "../services/api";

export default function PostComments({ workshopId, threadId, postId }) {
  const [items, setItems] = useState([]);
  const [newContent, setNewContent] = useState("");     // 원댓글 입력창
  const [replyParentId, setReplyParentId] = useState(null); // 현재 열려있는 '답글' 대상 댓글 id
  const [replyContent, setReplyContent] = useState(""); // 인라인 답글 입력값
  const replyRef = useRef(null);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}")); 

  const load = useCallback(async () => {
    const { data } = await commentAPI.list(workshopId, threadId, postId, 0, 100);
    setItems(Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []));
  }, [workshopId, threadId, postId]);

  useEffect(() => { load(); }, [load]);

  // 원댓글 등록
  async function onCreateRoot() {
    const content = newContent.trim();
    if (!content) return;
    await commentAPI.create(workshopId, threadId, postId, content, null, user?.nickname);
    await load();
    setNewContent("");
  }

  // 답글 토글
  function toggleReply(commentId) {
    setReplyContent("");
    setReplyParentId(prev => (prev === commentId ? null : commentId));
  }

  // 답글 등록
  async function submitReply() {
    const content = replyContent.trim();
    if (!content || !replyParentId) return;
    await commentAPI.create(workshopId, threadId, postId, content, replyParentId, user?.nickname);
    await load();
    setReplyContent("");
    setReplyParentId(null);
  }

  // 답글창 열릴 때 자동 포커스
  useEffect(() => {
    if (replyParentId && replyRef.current) replyRef.current.focus();
  }, [replyParentId]);

  async function onUpdate(commentId, content) {
    const next = (content ?? "").trim();
    if (!next) return;
    const { data } = await commentAPI.update(workshopId, threadId, postId, commentId, next);
    setItems(prev => prev.map(c => (c.id === data.id ? data : c)));
  }

  async function onDelete(commentId) {
    await commentAPI.remove(workshopId, threadId, postId, commentId);
    setItems(prev => prev.map(c => (c.id === commentId ? { ...c, isDeleted: true, content: "" } : c)));
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">댓글</h3>

      {/* 원댓글 입력창 */}
      <div className="flex gap-2 mb-4">
        <textarea
          className="flex-1 border rounded p-2"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button className="border rounded px-3" onClick={onCreateRoot}>등록</button>
      </div>

      <ul className="space-y-2">
        {items.map(c => (
          <li key={c.id} className="text-sm" style={{ paddingLeft: `${(c.depth ?? 0) * 16}px` }}>
            <div className="flex items-start gap-2">
              <span className="select-none">{(c.depth ?? 0) > 0 ? "ㄴ" : ""}</span>
              <div className="flex-1">
                <div className="text-gray-600">
                  <b>{c.writerNickname ?? c.writerId}</b>
                  <span className="ml-2">{c.isDeleted ? "삭제된 댓글입니다." : c.content}</span>
                </div>

                {!c.isDeleted && (
                  <>
                    <div className="mt-1 flex gap-2 text-xs text-blue-600">
                      <button onClick={() => toggleReply(c.id)}>
                        {replyParentId === c.id ? "답글 취소" : "답글"}
                      </button>
                      <button onClick={() => {
                        const next = prompt("내용 수정", c.content ?? "");
                        if (next != null) onUpdate(c.id, next);
                      }}>수정</button>
                      <button className="text-red-600" onClick={() => onDelete(c.id)}>삭제</button>
                    </div>

                    {/* 인라인 답글 입력창 */}
                    {replyParentId === c.id && (
                      <div className="mt-2 flex gap-2">
                        <textarea
                          ref={replyRef}
                          className="flex-1 border rounded p-2"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`@${c.writerNickname ?? c.writerId } 에게 답글`}
                        />
                        <button className="border rounded px-3" onClick={submitReply}>등록</button>
                        <button className="border rounded px-3" onClick={() => { setReplyParentId(null); setReplyContent(""); }}>
                          취소
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}