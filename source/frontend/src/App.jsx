import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetail from "./pages/WorkShopDetail";
import LoungeDetail from "./Components/LoungeDetail";
import ThreadDetail from "./Components/ThreadDetail";
import PostDetail from "./Components/PostDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// 친구기능
import MateList from "./pages/MateList";

// 대시보드
import DashboardProvider from "./Components/Dashboard/DashboardContext";
import DashboardPanel from "./Components/Dashboard/DashboardPanel";

// 스케줄
import ScheduleList from "./pages/ScheduleList";
import ScheduleForm from "./pages/ScheduleForm";

export default function App() {
  return (
    <DashboardProvider>
      <Router>
        <Routes>
          {/* 홈/인증 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 워크샵 목록 */}
          <Route path="/workshops" element={<WorkshopsPage />} />

          {/* 워크샵 상세 + 라운지/스레드/포스트 중첩 라우팅 */}
          <Route path="/workshops/:workshopId" element={<WorkshopDetail />}>
            <Route path="lounges/:loungeId" element={<LoungeDetail />} />
            <Route path="threads/:threadId" element={<ThreadDetail />} />
            <Route
              path="threads/:threadId/posts/:postId"
              element={<PostDetail />}
            />
          </Route>

          {/* 스케줄 라우트 */}
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

          {/* 친구 기능 */}
          <Route path="/mates/list" element={<MateList />} />

          {/* 기타 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 전역 오버레이 */}
        <DashboardPanel />
      </Router>
    </DashboardProvider>
  );
}
