import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ExamCategory } from "@/lib/data";

interface CategoryCardProps {
  category: ExamCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isDeveloping = category.id !== "education";

  return (
    <Link
      href={`/category/${category.id}`}
      className={`animate-enter bg-surface border border-line border-l-[5px] rounded-brand grid grid-cols-[62px_1fr_22px] items-center gap-3 p-3 transition-all hover:shadow-brand hover:-translate-y-0.5 ${isDeveloping ? 'opacity-60' : ''}`}
      style={{ borderLeftColor: category.color }}
    >
      <Image
        src={category.image}
        alt={category.title}
        width={62}
        height={62}
        className="object-contain"
      />
      <div>
        <h3 className="text-[15px] font-bold leading-tight flex flex-wrap items-center gap-2" style={{ color: category.color }}>
          {category.title}
          {isDeveloping && (
            <span className="text-[10px] bg-[#fff3e0] text-[#e67e22] px-2 py-0.5 rounded-full font-bold border border-[#e67e22]/30">
              កំពុងអភិវឌ្ឍ
            </span>
          )}
        </h3>
        <p className="text-muted text-xs mt-1 leading-snug">{category.description}</p>
      </div>
      <ChevronRight className="shrink-0" size={18} style={{ color: category.color }} />
    </Link>
  );
}
