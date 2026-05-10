"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase-client";

import { signOut } from "firebase/auth";

import {
  onValue,
  ref,
  set,
  remove,
} from "firebase/database";

import { useRouter } from "next/navigation";

type Category = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  image: string;
  questions: any[];
};

const emptyCategory: Category = {
  id: "",
  title: "",
  shortTitle: "",
  description: "",
  color: "#3b82f6",
  image: "",
  questions: [],
};

export default function DashboardPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<Category>(emptyCategory);

  // LOAD DATABASE
  useEffect(() => {
    const databaseRef = ref(db, "data/categories");

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCategories(Object.values(data));
      } else {
        setCategories([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // LOGOUT
  async function logout() {
    await signOut(auth);
    router.push("/");
  }

  // OPEN CREATE MODAL
  function openCreate() {
    setEditingIndex(null);

    setForm({
      ...emptyCategory,
      id: crypto.randomUUID(),
    });

    setIsOpen(true);
  }

  // OPEN EDIT MODAL
  function openEdit(
    e: React.MouseEvent,
    item: Category,
    index: number
  ) {
    e.stopPropagation();

    setEditingIndex(index);

    setForm(item);

    setIsOpen(true);
  }

  // SAVE CATEGORY
  async function saveCategory() {
    try {
      await set(ref(db, `data/categories/${form.id}`), form);

      setIsOpen(false);

      setForm(emptyCategory);

      setEditingIndex(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    }
  }

  // DELETE CATEGORY
  async function deleteCategory(
    e: React.MouseEvent,
    item: Category
  ) {
    e.stopPropagation();

    const confirmDelete = confirm(
      `Delete category "${item.title}"?`
    );

    if (!confirmDelete) return;

    try {
      await remove(ref(db, `data/categories/${item.id}`));
    } catch (error) {
      console.error(error);
      alert("Failed to delete.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <div className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/user/search")}
              className="rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
            >
              Search 🔍
            </button>

            <button
              onClick={openCreate}
              className="rounded-xl bg-emerald-600 px-4 py-2 hover:bg-emerald-500"
            >
              + Add Category
            </button>

            <button
              onClick={logout}
              className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl p-6">
        {loading ? (
          <div>Loading...</div>
        ) : categories.length === 0 ? (
          <div>No categories found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item, index) => (
              <div
                key={item.id}
                onClick={() =>
                  router.push(
                    `/user/dashboard/${item.id}`
                  )
                }
                className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:scale-[1.02] hover:bg-white/10"
              >
                {/* TOP */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="text-sm text-zinc-400">
                      {item.shortTitle}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) =>
                        openEdit(e, item, index)
                      }
                      className="rounded-lg bg-blue-600 px-3 py-1 text-sm hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) =>
                        deleteCategory(e, item)
                      }
                      className="rounded-lg bg-red-600 px-3 py-1 text-sm hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* TITLE */}
                <h2 className="mb-2 text-xl font-bold">
                  {item.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="mb-4 line-clamp-3 text-sm text-zinc-400">
                  {item.description}
                </p>

                {/* QUESTIONS */}
                <div className="text-sm text-zinc-500">
                  Questions:
                  {" "}
                  {item.questions?.length ?? 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold">
              {editingIndex !== null
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <div className="grid gap-4">
              <input
                value={form.id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id: e.target.value,
                  })
                }
                placeholder="ID"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />

              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Title"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />

              <input
                value={form.shortTitle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shortTitle: e.target.value,
                  })
                }
                placeholder="Short Title"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />

              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="rounded-xl bg-zinc-800 px-4 py-3 outline-none"
              />

              <input
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm({
                    ...form,
                    color: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-zinc-800 p-2"
              />

              <input
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                placeholder="Image URL"
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
                onClick={saveCategory}
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