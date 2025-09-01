import React from "react";
import { cn } from "../utils/cn";

// 더미 유저 데이터 (props로 교체 가능)
const user = {
  avatar: "/img/Kim_Developer.png",
  nickname: "김개발자",
  account: "Kim_developer",
};

const UserFooter = () => {
  return (
    <footer className={cn("user-footer")}>
      {/* 유저 프로필 */}
      <div className="user-footer__profile-row">
        <img
          src={user.avatar}
          alt="프로필"
          className="user-footer__avatar"
        />

        {/* 텍스트 컬럼 */}
        <div className="user-footer__textcol">
          {/* 닉네임 라인 + 전원 버튼 */}
          <div className="user-footer__nickname-row">
            <span className="user-footer__nickname">{user.nickname}</span>
            <button
              title="로그아웃"
              className="user-footer__power-btn"
              onClick={() => { /* TODO: 로그아웃 핸들러 */ }}
            >
              <img
                src="/img/btn_power.png"   /* public 폴더의 투명 PNG */
                alt="전원버튼"
                className="user-footer__power-icon"
              />
            </button>
          </div>

          {/* 아이디 라인 */}
          <span className="user-footer__account">{user.account}</span>
        </div>
      </div>

      {/* 하단 아이콘 버튼 */}
      <div className="user-footer__buttons">
        <button title="설정" className="user-footer__btn user-footer__btn--left">
          <img src="/img/btn_settings.png" className="user-footer__btn-img" alt="설정버튼" />
        </button>
        <button title="메일" className="user-footer__btn user-footer__btn--center">
          <img src="/img/btn_mail.png" className="user-footer__btn-img" alt="메일버튼" />
        </button>
        <button title="친구" className="user-footer__btn user-footer__btn--right">
          <img src="/img/btn_friends.png" className="user-footer__btn-img" alt="친구버튼" />
        </button>
      </div>
    </footer>
  );
};

export default UserFooter;