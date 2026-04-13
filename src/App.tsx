import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectStats from "./pages/ProjectStats";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects dark={dark} setDark={setDark} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail dark={dark} setDark={setDark} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id/stats"
          element={
            <ProtectedRoute>
              <ProjectStats dark={dark} setDark={setDark} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
