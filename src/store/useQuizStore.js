import { create } from "zustand";

export const LOCAL_KEY = "quiz_app_state_v1";

const defaultState = {
  user: null,
  questions: [],
  answers: {},
  currentIndex: 0,
  totalTimeSec: 300,
  remainingSec: 300,
  startedAt: null,
  finished: false,
  result: null,
};

export const useQuizStore = create((set, get) => ({
  ...defaultState,

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({ ...defaultState, ...parsed });
      console.log("Quiz state loaded from localStorage");
    } catch (e) {
      console.warn("Gagal load state:", e);
    }
  },

  saveToStorage: () => {
    try {
      const state = get();
      const toSave = {
        user: state.user,
        questions: state.questions,
        answers: state.answers,
        currentIndex: state.currentIndex,
        totalTimeSec: state.totalTimeSec,
        remainingSec: state.remainingSec,
        startedAt: state.startedAt,
        finished: state.finished,
        result: state.result,
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn("Gagal save state:", e);
    }
  },

  clearStorage: () => {
    localStorage.removeItem(LOCAL_KEY);
    set({ ...defaultState });
  },

  login: (username) => set(() => ({ user: username })),
  setQuestions: (qs) => set(() => ({ questions: qs })),

  startQuiz: ({ totalTimeSec }) =>
    set(() => ({
      startedAt: Date.now(),
      totalTimeSec,
      remainingSec: totalTimeSec,
      currentIndex: 0,
      answers: {},
      finished: false,
      result: null,
    })),

  time: () =>
    set((s) => {
      const newRemaining = Math.max(0, s.remainingSec - 1);
      return { remainingSec: newRemaining };
    }),

  answerCurrent: (choice) =>
    set((s) => {
      const idx = s.currentIndex;
      const q = s.questions[idx];
      const isCorrect = q.correct_answer === choice;
      const nextIndex = Math.min(s.questions.length, idx + 1);
      const newAnswers = { ...s.answers, [idx]: { answer: choice, isCorrect } };
      return {
        answers: newAnswers,
        currentIndex: nextIndex,
      };
    }),

  resetQuiz: () =>
    set((s) => {
      const updated = {
        answers: {},
        currentIndex: 0,
        remainingSec: s.totalTimeSec,
        finished: false,
        result: null,
        startedAt: Date.now(),
      };

      const newState = { ...s, ...updated };
      localStorage.setItem("quiz_app_state_v1", JSON.stringify(newState));

      return updated;
    }),

  finishQuiz: () =>
    set((s) => {
      const answers = s.answers || {};
      const total = s.questions.length;
      const answered = Object.keys(answers).length;
      const correct = Object.values(answers).filter((a) => a.isCorrect).length;
      const wrong = answered - correct;
      const result = { total, answered, correct, wrong };
      return { finished: true, result };
    }),
}));
