// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import WorkshopsPage from "./pages/WorkshopsPage";   // 선택(없으면 지우고 바로 WorkshopDetail만 써도 됨)
import WorkshopDetail from "./pages/WorkshopDetail";
import LoungeDetail from "./Components/LoungeDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* 워크샵 루트 */}
        <Route path="/workshops" element={<WorkshopsPage />} />

        {/* 워크샵 상세 + 라운지 중첩 라우팅 */}
        <Route path="/workshops/:workshopId" element={<WorkshopDetail />}>
          <Route path="lounges/:loungeId" element={<LoungeDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}