"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase-client";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";

type Question = {
  text: string;
  options: string[];
  answer: number;
  tags?: string[];
  categoryTitle?: string;
  categoryId?: string;
};

export default function SearchPage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  useEffect(() => {
    const databaseRef = ref(db, "data/categories");

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const categories = snapshot.val();
        const questionsList: Question[] = [];

        Object.values(categories).forEach((category: any) => {
          if (category.questions) {
            category.questions.forEach((q: any) => {
              questionsList.push({
                ...q,
                categoryTitle: category.title,
                categoryId: category.id,
              });
            });
          }
        });

        setAllQuestions(questionsList);
        setFilteredQuestions(questionsList);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const lowerTag = tagFilter.toLowerCase();

    const filtered = allQuestions.filter((q) => {
      const matchesText = q.text.toLowerCase().includes(lowerSearch);
      const matchesTag = lowerTag === "" || q.tags?.some(tag => tag.toLowerCase().includes(lowerTag));
      return matchesText && matchesTag;
    });

    setFilteredQuestions(filtered);
  }, [searchTerm, tagFilter, allQuestions]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-black/40 sticky top-0 z-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Search Questions</h1>
            <button
              onClick={() => router.push("/user/dashboard")}
              className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
            >
              ← Dashboard
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Search by question text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
            />
            <input
              type="text"
              placeholder="Filter by tag (e.g. math)..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 outline-none border border-white/5 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl p-6">
        {loading ? (
          <div className="text-center py-20 text-zinc-400">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            No questions found matching your search.
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredQuestions.map((q, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                    {q.categoryTitle}
                  </span>
                  {q.tags?.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 cursor-pointer hover:bg-blue-500/20"
                      onClick={() => setTagFilter(tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-bold mb-4">{q.text}</h2>

                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((option, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-3 text-sm ${
                        i === q.answer
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                          : "border-white/5 bg-zinc-900/50 text-zinc-400"
                      }`}
                    >
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push(`/user/dashboard/${q.categoryId}`)}
                    className="text-sm text-zinc-500 hover:text-white transition"
                  >
                    Manage Category →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
