import React, { useState } from "react";
import { openCreateWorkshopModal } from "./uiBus";
import "./WorkshopCards.css";

export default function WorkshopCards() {
  const [showJoin, setShowJoin] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (joining) return;
    try {
      setJoining(true);
      // TODO: 참가 API 연결
      alert("참가 API 연결 전이라 안내만 표시합니다.");
      setShowJoin(false);
      setInviteCode("");
    } catch (err) {
      console.error(err);
      alert("참가 중 오류가 발생했습니다.");
    } finally {
      setJoining(false);
    }
  };

  const CREATE_IMG = `${import.meta.env.BASE_URL}img/create_workshop.png`;
  const ENTRY_IMG  = `${import.meta.env.BASE_URL}img/entry_workshop.png`;

  return (
    <div className="wc-wrap">
      {/* 서버 생성 카드 */}
      <button
        type="button"
        className="wc-card"
        onClick={() => {
          console.log("[WorkshopCards] click: open-create-workshop");
          openCreateWorkshopModal();
        }}
      >
        <div className="wc-icon" aria-hidden="true">
          <img className="wc-icon__img" src={CREATE_IMG} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="wc-texts">
          <div className="wc-title">워크샵 생성</div>
          <div className="wc-desc">새로운 워크샵을 만들어 팀을 초대하세요</div>
        </div>
      </button>

      {/* 서버 참가 카드 */}
      <button type="button" className="wc-card" onClick={() => setShowJoin(true)}>
        <div className="wc-icon" aria-hidden="true">
          {/* ✅ 추가: 배경 위에 투명 PNG 오버레이 */}
          <img className="wc-icon__img" src={ENTRY_IMG} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="wc-texts">
          <div className="wc-title">워크샵 참가</div>
          <div className="wc-desc">초대 코드로 기존 워크샵에 참가하세요</div>
        </div>
      </button>

      {/* 참가 모달 */}
      {showJoin && (
        <div className="wc-modal__overlay" onClick={() => setShowJoin(false)}>
          <div className="wc-modal__card" onClick={(e) => e.stopPropagation()}>
            <h3 className="wc-modal__title">초대 코드로 참가</h3>
            <form className="wc-form" onSubmit={handleJoin}>
              <input
                required
                className="wc-field"
                placeholder="초대 코드"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <div className="wc-actions">
                <button
                  type="button"
                  className="wc-btn wc-btn--ghost"
                  onClick={() => setShowJoin(false)}
                  disabled={joining}
                >
                  취소
                </button>
                <button type="submit" className="wc-btn wc-btn--primary" disabled={joining}>
                  {joining ? "참가 중..." : "참가"}
                </button>
              </div>
            </form>
            <p className="wc-helper">※ API 연결 전: 동작은 안내 알림만 표시됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}