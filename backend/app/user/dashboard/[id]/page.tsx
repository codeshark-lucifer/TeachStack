"use client";

import { useEffect, useState } from "react";

import { db } from "@/app/lib/firebase-client";

import { get, ref, set } from "firebase/database";

import { useParams, useRouter } from "next/navigation";

type Question = {
  text: string;
  options: string[];
  answer: number;
  tags?: string[];
};

type Category = {
  id: string;
  title: string;
  questions: Question[];
};

const emptyQuestion: Question = {
  text: "",
  options: ["", "", "", ""],
  answer: 0,
  tags: [],
};

export default function CategoryPage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [form, setForm] = useState<Question>(emptyQuestion);

  // LOAD CATEGORY
  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const snapshot = await get(ref(db, `data/categories/${id}`));

      if (!snapshot.exists()) {
        setLoading(false);
        return;
      }

      setCategory(snapshot.val());
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  // OPEN CREATE
  function openCreate() {
    setEditingIndex(null);

    setForm(emptyQuestion);

    setIsOpen(true);
  }

  // OPEN EDIT
  function openEdit(question: Question, index: number) {
    setEditingIndex(index);

    setForm(question);

    setIsOpen(true);
  }

  // SAVE QUESTION
  async function saveQuestion() {
    if (!category) return;

    const updatedQuestions = [...(category.questions || [])];

    if (editingIndex !== null) {
      updatedQuestions[editingIndex] = form;
    } else {
      updatedQuestions.push(form);
    }

    try {
      await set(ref(db, `data/categories/${id}/questions`), updatedQuestions);

      setCategory({
        ...category,
        questions: updatedQuestions,
      });

      setIsOpen(false);

      setForm(emptyQuestion);

      setEditingIndex(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    }
  }

  // DELETE QUESTION
  async function deleteQuestion(index: number) {
    if (!category) return;

    const confirmDelete = confirm("Delete question?");

    if (!confirmDelete) return;

    const updatedQuestions = category.questions.filter((_, i) => i !== index);

    try {
      await set(ref(db, `data/categories/${id}/questions`), updatedQuestions);

      setCategory({
        ...category,
        questions: updatedQuestions,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        Loading...
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        Category not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/user/dashboard")}
            className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold">{category.title}</h1>

          <button
            onClick={openCreate}
            className="rounded-xl bg-emerald-600 px-4 py-2 hover:bg-emerald-500"
          >
            + Add Question
          </button>
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid gap-4">
          {category.questions?.map((question, index) => (
            <div
              key={index}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              {/* QUESTION */}
              <h2 className="mb-4 text-lg font-semibold">
                {index + 1}. {question.text}
              </h2>

              {/* OPTIONS */}
              <div className="space-y-2">
                {question.options.map((option, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-3 ${
                      i === question.answer
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-zinc-900"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {option}
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openEdit(question, index)}
                  className="rounded-xl bg-blue-600 px-4 py-2 hover:bg-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteQuestion(index)}
                  className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold">
              {editingIndex !== null ? "Edit Question" : "Add Question"}
            </h2>

            <div className="grid gap-4">
              {/* QUESTION */}
              <textarea
                rows={4}
                value={form.text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    text: e.target.value,
                  })
                }
                placeholder="Question"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />

              {/* OPTIONS */}
              {form.options.map((option, index) => (
                <input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const updated = [...form.options];

                    updated[index] = e.target.value;

                    setForm({
                      ...form,
                      options: updated,
                    });
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
                />
              ))}

              {/* ANSWER */}
              <select
                value={form.answer}
                onChange={(e) =>
                  setForm({
                    ...form,
                    answer: Number(e.target.value),
                  })
                }
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              >
                <option value={0}>Correct Answer: Option 1</option>

                <option value={1}>Correct Answer: Option 2</option>

                <option value={2}>Correct Answer: Option 3</option>

                <option value={3}>Correct Answer: Option 4</option>
              </select>

              {/* TAGS */}
              <input
                value={form.tags?.join(", ") || ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== "");
                  
                  setForm({
                    ...form,
                    tags,
                  });
                }}
                placeholder="Tags (e.g. culture, math, highschool)"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={saveQuestion}
                className="rounded-xl bg-emerald-600 px-4 py-2 hover:bg-emerald-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
