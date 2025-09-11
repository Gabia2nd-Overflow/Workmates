import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { workshopAPI } from "../services/api";
import { announceWorkshopCreated } from "./main_home/uiBus";

/**
 * 공용 워크샵 생성 모달
 * - .ws-modal__* 스타일 사용 (Sidebar.css)
 * - 포탈로 body 최상단에 렌더 → 모든 요소 위에 덮임
 * - show=true 동안 body 스크롤 잠금
 */
export default function CreateWorkshopModal({ show, onClose }) {
  const [form, setForm] = useState({
    workshopName: "",
    workshopIconImage: "",
    workshopDescription: "",
  });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // show 동안 body 스크롤 잠금
  useEffect(() => {
    if (!show) return;
    document.body.classList.add("ws-modal-open");
    return () => document.body.classList.remove("ws-modal-open");
  }, [show]);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creating) return;

    try {
      setCreating(true);
      const { data } = await workshopAPI.create(form);

      // Sidebar 즉시 반영을 위한 전역 브로드캐스트
      announceWorkshopCreated(data);

      setForm({ workshopName: "", workshopIconImage: "", workshopDescription: "" });
      onClose?.();
      navigate(`/workshops/${data.workshopId}`);
    } catch (err) {
      console.error(err);
      alert("워크샵 생성 중 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  };

  // 포탈로 body에 붙인다
  return createPortal(
    <div className="ws-modal__overlay" onClick={onClose}>
      <div className="ws-modal__card" onClick={(e) => e.stopPropagation()}>
        <h3 className="ws-modal__title">새 워크샵 만들기</h3>
        <form className="ws-modal__form" onSubmit={handleSubmit}>
          <input
            required
            className="ws-modal__field"
            placeholder="워크샵 이름"
            value={form.workshopName}
            onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
          />
          <input
            className="ws-modal__field"
            placeholder="아이콘 이미지 URL(선택)"
            value={form.workshopIconImage}
            onChange={(e) => setForm({ ...form, workshopIconImage: e.target.value })}
          />
          <textarea
            className="ws-modal__field"
            placeholder="설명(선택)"
            value={form.workshopDescription}
            onChange={(e) => setForm({ ...form, workshopDescription: e.target.value })}
          />
          <div className="ws-modal__actions">
            <button type="button" className="ws-btn ws-btn--ghost" onClick={onClose} disabled={creating}>
              취소
            </button>
            <button type="submit" className="ws-btn ws-btn--primary" disabled={creating}>
              {creating ? "생성 중..." : "생성"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}