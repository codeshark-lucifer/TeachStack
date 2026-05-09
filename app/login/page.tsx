"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "ការចូលប្រើប្រាស់បានបរាជ័យ។");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (method: () => Promise<void>) => {
    setError("");
    setLoading(true);
    try {
      await method();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "ការចូលប្រើប្រាស់បានបរាជ័យ។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-40px)] md:min-h-0 items-center justify-center p-4">
      <Link
        href="/"
        className="self-start flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-all"
      >
        <ArrowLeft size={20} />
        ត្រឡប់ក្រោយ
      </Link>

      <div className="w-full max-w-[340px] flex flex-col items-center">
        <div className="relative w-20 h-20 mb-6">
          <Image
            src="/images/logo1.png"
            alt="TeachStack logo"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-ink">ចូលប្រើប្រាស់</h1>
        <p className="text-muted text-sm text-center mb-8">
          សូមចូលប្រើប្រាស់ ដើម្បីរក្សាទុកលទ្ធផល និងតាមដានការរីកចម្រើនរបស់អ្នក។
        </p>

        {error && (
          <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-brand text-center">
            {error}
          </div>
        )}

        <form className="w-full space-y-4 mb-8" onSubmit={handleEmailLogin}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-ink" htmlFor="email">
              អ៊ីមែល
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-surface border border-line rounded-brand pl-11 pr-4 focus:border-primary outline-none transition-all text-ink placeholder:text-muted/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-ink" htmlFor="password">
              លេខសម្ងាត់
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-surface border border-line rounded-brand pl-11 pr-4 focus:border-primary outline-none transition-all text-ink placeholder:text-muted/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-white rounded-brand font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <LogIn size={20} />
                ចូលប្រើប្រាស់
              </>
            )}
          </button>
        </form>

        <div className="w-full flex items-center gap-3 mb-8">
          <div className="h-px bg-line flex-1" />
          <span className="text-[11px] text-muted font-bold uppercase tracking-wider">ឬបន្តជាមួយ</span>
          <div className="h-px bg-line flex-1" />
        </div>

        <div className="w-full">
          <button 
            onClick={() => handleSocialLogin(signInWithGoogle)}
            disabled={loading}
            className="w-full h-12 border border-line rounded-brand flex items-center justify-center gap-2 hover:bg-surface transition-all font-semibold text-sm disabled:opacity-50"
          >
            <i className="fa-brands fa-google text-lg"></i>
            បន្តជាមួយ Google
          </button>
        </div>

        <p className="mt-8 text-sm text-muted">
          មិនទាន់មានគណនី?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            ចុះឈ្មោះឥឡូវនេះ
          </Link>
        </p>
      </div>
    </div>
  );
}
