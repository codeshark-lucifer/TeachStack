"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, User, Save, LogOut, History, Award, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { QuizResult } from "@/lib/types";

export default function ProfilePage() {
  const { user, logout, updateUserDisplayName, loading } = useAuth();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(user.displayName || "");

      // Load History from Firebase
      const historyRef = ref(db, `user_progress/${user.uid}`);
      const unsubscribe = onValue(historyRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const resultsArray = Object.values(data) as QuizResult[];
          // Sort by date descending
          resultsArray.sort((a, b) => 
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
          setHistory(resultsArray);
        } else {
          setHistory([]);
        }
        setLoadingHistory(false);
      });

      return () => unsubscribe();
    }
  }, [user, loading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUserDisplayName(name);
      setMessage({ type: "success", text: "ព័ត៌មានត្រូវបានរក្សាទុក!" });
    } catch {
      setMessage({ type: "error", text: "ការរក្សាទុកបានបរាជ័យ។" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || "អ្នកប្រើប្រាស់";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('km-KH', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return "0 នាទី";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} នាទី ${secs} វិនាទី`;
  };

  const handleViewResult = (result: QuizResult) => {
    localStorage.setItem("TeachStackResult", JSON.stringify(result));
    router.push("/result");
  };

  return (
    <div className="max-w-[800px] mx-auto p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-all w-fit"
      >
        <ArrowLeft size={20} />
        ត្រឡប់ទៅទំព័រដើម
      </Link>

      <div className="grid md:grid-cols-[1fr,1.5fr] gap-6">
        {/* Left Side: Profile Info */}
        <div className="space-y-6">
          <div className="bg-surface border border-line rounded-brand p-6">
            <div className="flex flex-col items-center mb-8">
              <Avatar 
                src={user.photoURL} 
                name={displayName} 
                size={80} 
                className="mb-4 text-2xl"
              />
              <h1 className="text-xl font-bold text-ink text-center">{displayName}</h1>
              <p className="text-muted text-xs text-center">{user.email}</p>
            </div>

            {message.text && (
              <div className={`p-3 mb-6 rounded-brand text-xs text-center ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink" htmlFor="name">
                  ឈ្មោះពេញ
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ឈ្មោះរបស់អ្នក"
                    className="w-full h-10 bg-surface border border-line rounded-brand pl-10 pr-4 focus:border-primary outline-none transition-all text-sm text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full h-10 bg-primary text-white rounded-brand font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-4 disabled:opacity-50 text-sm"
              >
                {isUpdating ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Save size={16} />
                    រក្សាទុក
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => logout()}
              className="w-full h-10 border border-red-200 text-red-500 rounded-brand font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all mt-3 text-sm"
            >
              <LogOut size={16} />
              ចាកចេញ
            </button>
          </div>
        </div>

        {/* Right Side: History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-ink">ប្រវត្តិការធ្វើតេស្ត</h2>
          </div>

          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface border border-line border-dashed rounded-brand">
              <span className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-3" />
              <p className="text-muted text-sm">កំពុងទាញយកទិន្នន័យ...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center p-12 bg-surface border border-line border-dashed rounded-brand">
              <History size={40} className="mx-auto text-muted/30 mb-4" />
              <p className="text-muted font-medium">មិនទាន់មានប្រវត្តិការធ្វើតេស្តនៅឡើយទេ</p>
              <Link href="/" className="text-primary font-bold text-sm mt-2 inline-block hover:underline">
                ចាប់ផ្តើមធ្វើតេស្តឥឡូវនេះ
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const percent = Math.round((item.correct / item.total) * 100);
                return (
                  <div 
                    key={item.id}
                    onClick={() => handleViewResult(item)}
                    className="group bg-surface border border-line rounded-2xl p-4 hover:border-primary/50 transition-all cursor-pointer hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          percent >= 80 ? "bg-green-100 text-green-700" :
                          percent >= 50 ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {percent}%
                        </div>
                        <div>
                          <h3 className="font-bold text-ink text-sm line-clamp-1">
                            {item.rawSetId ? `វិញ្ញាសាទី ${item.rawSetId.replace('set-', '')}` : "វិញ្ញាសាទូទៅ"}
                          </h3>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-muted flex items-center gap-1 font-medium">
                              <Calendar size={10} />
                              {formatDate(item.completedAt)}
                            </span>
                            <span className="text-[10px] text-muted flex items-center gap-1 font-medium">
                              <Clock size={10} />
                              {formatTimeSpent(item.timeSpent)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-ink font-bold text-sm">
                          <Award size={14} className="text-yellow-500" />
                          <span>{item.correct}/{item.total}</span>
                        </div>
                        <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          មើលលម្អិត
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
