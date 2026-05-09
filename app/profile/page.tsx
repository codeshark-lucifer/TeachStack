"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { ArrowLeft, User, Mail, Save, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";

export default function ProfilePage() {
  const { user, logout, updateUserDisplayName, loading } = useAuth();
  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setName(user.displayName || "");
    }
  }, [user, loading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUserDisplayName(name);
      setMessage({ type: "success", text: "ព័ត៌មានត្រូវបានរក្សាទុក!" });
    } catch (error) {
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

  return (
    <div className="max-w-[500px] mx-auto p-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-all w-fit"
      >
        <ArrowLeft size={20} />
        ត្រឡប់ទៅទំព័រដើម
      </Link>

      <div className="bg-surface border border-line rounded-brand p-6 mb-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar 
            src={user.photoURL} 
            name={displayName} 
            size={100} 
            className="mb-4 text-3xl"
          />
          <h1 className="text-2xl font-bold text-ink">{displayName}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        {message.text && (
          <div className={`p-3 mb-6 rounded-brand text-sm text-center ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-ink" htmlFor="name">
              ឈ្មោះពេញ
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ឈ្មោះរបស់អ្នក"
                className="w-full h-12 bg-surface border border-line rounded-brand pl-11 pr-4 focus:border-primary outline-none transition-all text-ink"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-ink" htmlFor="email">
              អ៊ីមែល
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="w-full h-12 bg-muted/20 border border-line rounded-brand pl-11 pr-4 outline-none text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full h-12 bg-primary text-white rounded-brand font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-6 disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save size={20} />
                រក្សាទុកព័ត៌មាន
              </>
            )}
          </button>
        </form>
      </div>

      <button
        onClick={() => logout()}
        className="w-full h-12 border border-red-200 text-red-500 rounded-brand font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
      >
        <LogOut size={20} />
        ចាកចេញពីគណនី
      </button>
    </div>
  );
}
