import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WorkshopsPage from "./pages/WorkshopsPage";
import WorkshopDetail from "./pages/WorkShopDetail";
import LoungeDetail from "./Components/LoungeDetail";
import ThreadDetail from "./components/ThreadDetail";
import PostDetail from "./Components/PostDetail"; // 추가
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}
