import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import { useQuizStore } from "./store/useQuizStore";

export default function App() {
  const loadFromStorage = useQuizStore((s) => s.loadFromStorage);
  const user = useQuizStore((s) => s.user);

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/quiz" /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/quiz"
            element={
              <Protected>
                <Quiz />
              </Protected>
            }
          />
          <Route
            path="/result"
            element={
              <Protected>
                <Result />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const user = useQuizStore((s) => s.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);
  if (!user) return null;
  return children;
}
