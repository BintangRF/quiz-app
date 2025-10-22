import axios from "axios";

const API_BASE = "https://opentdb.com";

export async function fetchQuestions(
  amount = 10,
  category = "",
  difficulty = ""
) {
  const params = new URLSearchParams();
  params.append("amount", amount);

  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);

  params.append("type", "multiple");

  const url = `${API_BASE}/api.php?${params.toString()}`;
  const res = await axios.get(url);

  if (res.data.response_code !== 0)
    throw new Error("Gagal mengambil soal dari API.");

  const decode = (s) => {
    const doc = new DOMParser().parseFromString(s, "text/html");
    return doc.documentElement.textContent;
  };

  return res.data.results.map((q, i) => ({
    id: `${i}-${q.question.substring(0, 10)}`,
    question: decode(q.question),
    correct_answer: decode(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map(decode),
    all_answers: shuffle([
      decode(q.correct_answer),
      ...q.incorrect_answers.map(decode),
    ]),
  }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
