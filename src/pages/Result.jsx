import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/useQuizStore";

export default function Result() {
  const result = useQuizStore((s) => s.result);
  const user = useQuizStore((s) => s.user);
  const navigate = useNavigate();

  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const clearStorage = useQuizStore((s) => s.clearStorage);

  if (!result)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  function handleRestart() {
    resetQuiz();
    navigate("/quiz", { replace: true });
  }

  function handleBackToMenu() {
    clearStorage();
    navigate("/login");
  }

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-md w-full text-center mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Hasil Kuis</h2>

      <div className="bg-gray-100 rounded-xl p-5 text-left space-y-3 mb-6">
        <div>
          <span className="font-semibold text-gray-600">User:</span>{" "}
          <span className="text-gray-800">{user}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Total Soal:</span>{" "}
          <span className="text-gray-800">{result.total}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Terjawab:</span>{" "}
          <span className="text-gray-800">{result.answered}</span>
        </div>
        <div className="text-green-600 font-semibold">
          Benar: {result.correct}
        </div>
        <div className="text-red-500 font-semibold">Salah: {result.wrong}</div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleRestart}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
        >
          Coba Lagi
        </button>

        <button
          onClick={handleBackToMenu}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}
