import React from "react";
import { cn } from "../utils/cn";

// 더미 유저 데이터 (props로 교체 가능)
const user = {
  avatar: "/img/김개발자프사.png",
  nickname: "김개발자",
  account: "Kim_developer",
};

const UserFooter = () => {
  return (
    <footer
      className={cn(
        "w-[300px] h-[120px] px-3 py-2 flex flex-col items-center fixed bottom-0 left-0 z-50",
        "bg-[#FFDFE4]"
      )}
      style={{ border: "1px solid #C5C5C5" }}
    >
      {/* 유저 프로필 */}
      <div className="w-full flex items-center mb-2">
        <img
          src={user.avatar}
          alt="프로필"
          className="w-16 h-16 rounded-lg mr-2 border border-gray-200 object-cover"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-[18px] text-[#000000] truncate">
            {user.nickname}
          </span>
          <span className="text-[13px] text-gray-600 truncate">
            {user.account}
          </span>
        </div>
      </div>
      
      {/* 하단 아이콘 버튼 */}
      <div className="flex justify-between items-center w-full px-1 mt-auto">
  <button
    title="설정"
    className="flex items-center justify-start w-1/3"
  >
    <img src="/img/설정버튼.png" className="w-14 h-7" alt="설정버튼" />
  </button>
  <button
    title="메일"
    className="flex items-center justify-center w-1/3"
  >
    <img src="/img/메일버튼.png" className="w-14 h-7" alt="메일버튼" />
  </button>
  <button
    title="친구"
    className="flex items-center justify-end w-1/3"
  >
    <img src="/img/친구버튼.png" className="w-14 h-7" alt="친구버튼" />
  </button>
</div>
</footer>
  );
};

export default UserFooter;
