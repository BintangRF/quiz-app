import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEY, useQuizStore } from "../store/useQuizStore";
import { fetchQuestions } from "../api/api";

export default function Login() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSavedQuiz, setHasSavedQuiz] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(3);

  const login = useQuizStore((s) => s.login);
  const setQuestions = useQuizStore((s) => s.setQuestions);
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const saveToStorage = useQuizStore((s) => s.saveToStorage);
  const loadFromStorage = useQuizStore((s) => s.loadFromStorage);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.questions?.length && !parsed?.finished) {
          setHasSavedQuiz(true);
        }
      } catch {
        localStorage.removeItem(LOCAL_KEY);
      }
    }
  }, []);

  async function handleStart(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Masukkan nama dulu.");
    if (questionCount <= 0) return alert("Masukkan soal minimal 1.");
    if (timeLimit <= 0) return alert("Masukkan waktu minimal 1 menit.");

    setLoading(true);
    try {
      login(name.trim());
      const qs = await fetchQuestions(questionCount);
      setQuestions(qs);
      startQuiz({ totalTimeSec: timeLimit * 60 });
      saveToStorage();
      navigate("/quiz");
    } catch (err) {
      alert("Gagal mengambil soal: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleResume() {
    loadFromStorage();
    navigate("/quiz");
  }

  return (
    <div className="bg-white shadow-xl rounded-xl w-full max-w-md mx-auto p-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Kuis Random
      </h1>

      <form onSubmit={handleStart} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Kamu
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama kamu..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah Soal
          </label>
          <input
            type="number"
            value={questionCount}
            min={1}
            max={50}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batas Waktu (menit)
          </label>
          <input
            type="number"
            value={timeLimit}
            min={1}
            max={60}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2.5 rounded-lg text-white font-semibold shadow-sm transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Memuat Soal..." : "Mulai Kuis"}
          </button>

          {hasSavedQuiz && (
            <button
              type="button"
              onClick={handleResume}
              className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm transition"
            >
              Lanjutkan Kuis
            </button>
          )}
        </div>
      </form>

      {hasSavedQuiz && (
        <div className="text-sm text-gray-500 text-center mt-4">
          Kamu punya kuis yang belum selesai.
        </div>
      )}
    </div>
  );
}
