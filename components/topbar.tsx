"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Moon, Sun, Menu, User, X, LogOut, Home, Building2, PieChart, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/avatar";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    // Check if View Transitions API is supported
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || "អ្នកប្រើប្រាស់";

  return (
    <>
      <header className="flex items-center justify-between min-h-[54px] mb-[18px] sticky top-0 z-[100] bg-paper border-b border-line -mx-4 px-4 md:-mx-7 md:px-7 transition-all duration-500">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-[42px] h-[42px] border border-line rounded-brand bg-surface text-primary inline-flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors relative overflow-hidden"
            aria-label="បើកម៉ឺនុយ"
          >
            <Menu 
              size={20} 
              className={`transition-all duration-500 absolute ${isMenuOpen ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"}`} 
            />
            <X 
              size={20} 
              className={`transition-all duration-500 absolute ${isMenuOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"}`} 
            />
          </button>
          
          <button
            onClick={toggleTheme}
            className="w-[42px] h-[42px] border border-line rounded-brand bg-surface text-primary inline-flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors relative overflow-hidden"
            aria-label="ប្តូរពណ៌ងងឹត"
          >
            <Sun className="transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 absolute" size={20} />
            <Moon className="transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute" size={20} />
          </button>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center"
          aria-label="ទំព័រដើម"
        >
          <Image
            src="/images/logo.png"
            alt="TeachStack Logo"
            width={88}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <Link
          href={user ? "/profile" : "/login"}
          className="flex items-center justify-end"
        >
          <Avatar 
            src={user?.photoURL} 
            name={displayName} 
            size={42} 
          />
        </Link>
      </header>

      <div 
        className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? "grid-rows-[1fr] opacity-100 mb-[18px]" : "grid-rows-[0fr] opacity-0 mb-0"
        }`}
      >
        <nav className="min-h-0 flex flex-col gap-1 bg-surface border border-line rounded-brand p-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md text-ink font-semibold px-4 py-3 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={20} className="text-primary" />
            ទំព័រដើម
          </Link>
          <Link
            href="/#categories"
            className="flex items-center gap-3 rounded-md text-ink font-semibold px-4 py-3 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Building2 size={20} className="text-primary" />
            វិញ្ញាសាប្រភេទក្រសួង
          </Link>
          <Link
            href="/result"
            className="flex items-center gap-3 rounded-md text-ink font-semibold px-4 py-3 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <PieChart size={20} className="text-primary" />
            លទ្ធផល
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 rounded-md text-ink font-semibold px-4 py-3 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Info size={20} className="text-primary" />
            អំពីយើងខ្ញុំ
          </Link>
          
          <div className="h-px bg-line my-1" />
          
          {user ? (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left rounded-md text-red-500 font-semibold px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <LogOut size={20} />
              ចាកចេញ
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-md text-ink font-semibold px-4 py-3 hover:bg-primary/5 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={20} className="text-primary" />
              ចូលប្រើប្រាស់
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
