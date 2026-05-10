"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase-client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/user/dashboard");
      }
    });

    return () => unsub();
  }, [router]);

  async function register() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/user/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/user/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {isLogin ? "Login to continue" : "Register a new account"}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />

          <button
            onClick={isLogin ? login : register}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          {/* <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-zinc-300 hover:bg-white/10"
          >
            {isLogin
              ? "Switch to Register"
              : "Switch to Login"}
          </button> */}
        </div>
      </div>
    </main>
  );
}
