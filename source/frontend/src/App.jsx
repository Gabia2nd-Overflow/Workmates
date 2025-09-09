import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetail from "./pages/WorkShopDetail";
import LoungeDetail from "./Components/LoungeDetail";
import ThreadDetail from "./Components/ThreadDetail";
import PostDetail from "./Components/PostDetail"; // 추가
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// 대시보드 페이지 관련
import DashboardProvider from "./Components/Dashboard/DashboardContext";
import DashboardPanel from "./Components/Dashboard/DashboardPanel";
// 스케줄 페이지 관련
import ScheduleList from "./pages/ScheduleList";
import ScheduleForm from "./pages/ScheduleForm";

export default function App() {
  return (
    <DashboardProvider>
      <Router>
        <Routes>
          {/* ⬇️ 각 페이지 파일 내부에서 <Header />를 렌더하세요(기존 방식 유지) */}
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

          {/* ✅ 스케줄 라우트 추가 */}
          <Route
            path="/schedules/:workshopId/schedules"
            element={<ScheduleList />}
          />
          <Route
            path="/schedules/:workshopId/schedules/new"
            element={<ScheduleForm mode="create" />}
          />
          <Route
            path="/schedules/:scheduleId/edit"
            element={<ScheduleForm mode="edit" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 🔹 전역 오버레이: 어디서든 열 수 있도록 항상 마운트 */}
        <DashboardPanel />
      </Router>
    </DashboardProvider>
  );
}