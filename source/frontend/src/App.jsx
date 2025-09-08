import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetail from "./pages/WorkShopDetail";
import LoungeDetail from "./Components/LoungeDetail";
import ThreadDetail from "./Components/ThreadDetail";
import PostDetail from "./Components/PostDetail"; // 추가
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// ✅ 대시보드 전역 컨텍스트 & 패널
import DashboardProvider from "./context/DashboardProvider";
import Header from "./Components/Header";
import DashboardPanel from "./Components/Dashboard/DashboardPanel";

export default function App() {
  return (
    <DashboardProvider>
      <Router>
        {/* 상단 고정 헤더 (useNavigate 사용하므로 Router 내부에 위치) */}
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/workshops" element={<WorkshopsPage />} />

          {/* 워크샵 상세 + 라운지/스레드 중첩 라우팅 */}
          <Route path="/workshops/:workshopId" element={<WorkshopDetail />}>
            <Route path="lounges/:loungeId" element={<LoungeDetail />} />
            <Route path="threads/:threadId" element={<ThreadDetail />} />
            <Route path="threads/:threadId/posts/:postId" element={<PostDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 전역 오버레이 드로어 (항상 마운트) */}
        <DashboardPanel />
      </Router>
    </DashboardProvider>
  );
}
