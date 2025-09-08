import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* 공용 로그아웃 훅: 어디서든 동일한 동작 재사용 */
export function useLogout(redirect = "/login") {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("로그아웃되었습니다.");
    navigate(redirect);
  };
}