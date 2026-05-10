import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ExamCategory } from "@/lib/types";

interface CategoryCardProps {
  category: ExamCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="animate-enter bg-surface border border-line border-l-[5px] rounded-brand grid grid-cols-[62px_1fr_22px] items-center gap-3 p-3 transition-all hover:shadow-brand hover:-translate-y-0.5 group"
      style={{ borderLeftColor: category.color }}
    >
      <div className="relative w-[62px] h-[62px] flex items-center justify-center bg-paper rounded-lg p-1 group-hover:scale-110 transition-transform">
        <Image
          src={category.image}
          alt={category.title}
          width={54}
          height={54}
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="text-[15px] font-bold leading-tight" style={{ color: category.color }}>
          {category.title}
        </h3>
        <p className="text-muted text-xs mt-1 leading-snug line-clamp-2">{category.description}</p>
      </div>
      <ChevronRight className="shrink-0 group-hover:translate-x-1 transition-transform" size={18} style={{ color: category.color }} />
    </Link>
  );
}
