"use client";

import Image from "next/image";
import { User as UserIcon } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 44, className = "" }: AvatarProps) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
  
  // Telegram-style colors based on name
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  
  const colorIndex = name ? name.length % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={`rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-line/10 transition-all duration-500 ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={name || "User"}
            fill
            sizes={`${size}px`}
            className="object-cover"
          />
        </div>
      ) : name ? (
        <div className={`w-full h-full ${bgColor} text-white flex items-center justify-center font-bold text-lg`}>
          {firstLetter}
        </div>
      ) : (
        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center">
          <UserIcon size={size * 0.5} />
        </div>
      )}
    </div>
  );
}
