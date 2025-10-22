import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { useQuizStore } from "../store/useQuizStore";

export default function Quiz() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const {
    questions,
    currentIndex,
    remainingSec,
    totalTimeSec,
    answers,
    user,
    answerCurrent,
    time,
    finishQuiz,
    saveToStorage,
    loadFromStorage,
  } = useQuizStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!questions || questions.length === 0) {
      navigate("/login");
      return;
    }

    if (!timerRef.current) {
      timerRef.current = setInterval(() => time(), 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [questions, user]);

  useEffect(() => {
    saveToStorage();
  }, [answers, currentIndex, remainingSec]);

  useEffect(() => {
    if (remainingSec <= 0) {
      clearInterval(timerRef.current);
      finishQuiz();
      saveToStorage();
      navigate("/result");
    }
  }, [remainingSec]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      clearInterval(timerRef.current);
      finishQuiz();
      saveToStorage();
      navigate("/result");
    }
  }, [currentIndex, questions.length]);

  if (!questions || questions.length === 0) return null;
  if (currentIndex >= questions.length) return null;

  const q = questions[currentIndex];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;

  function handleAnswer(choice) {
    answerCurrent(choice);
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4 bg-linear-to-r from-blue-100 to-indigo-100 p-4 rounded-lg shadow-sm">
        <div>
          <div className="text-sm text-gray-500">User</div>
          <div className="font-medium text-indigo-700">{user}</div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-500">Waktu</div>
          <div className="font-mono text-xl text-indigo-600">
            {fmt(remainingSec)} / {fmt(totalTimeSec)}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Progress</div>
          <div className="font-medium text-indigo-700">
            {answeredCount} / {total} dijawab
          </div>
        </div>
      </div>

      {/* Kartu soal */}
      <div className="border rounded-xl p-6 bg-white shadow-md">
        <QuestionCard
          q={q}
          index={currentIndex}
          total={total}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
