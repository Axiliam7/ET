import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { LearnerProvider } from "./context/LearnerContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/LessonPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { extractSessionParams, setupExitHandlers } from "./utils/sessionTracking";

export default function App() {
  useEffect(() => {
    extractSessionParams();
    const detach = setupExitHandlers();
    return () => detach();
  }, []);

  return (
    <LearnerProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="lesson/:slug" element={<LessonPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
        </Route>
      </Routes>
    </LearnerProvider>
  );
}
