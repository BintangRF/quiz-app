import React from "react";

export default function QuestionCard({ q, index, total, onAnswer }) {
  return (
    <div className="bg-linear-to-br from-indigo-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span className="font-medium text-indigo-600">
          Soal {index + 1} / {total}
        </span>
      </div>

      <h2
        className="text-lg font-semibold mb-6 text-gray-800 min-h-16"
        dangerouslySetInnerHTML={{ __html: q.question }}
      />

      <div className="grid gap-3">
        {q.all_answers.map((a, i) => (
          <button
            key={i}
            onClick={() => onAnswer(a)}
            className="text-left px-4 py-3 rounded-lg border border-transparent bg-white hover:bg-indigo-500 hover:text-white hover:shadow-md transition-all duration-200"
            dangerouslySetInnerHTML={{ __html: a }}
          />
        ))}
      </div>
    </div>
  );
}
