import Image from "next/image";
import { Topbar } from "@/components/topbar";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/api";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Topbar />

      <section className="bg-primary rounded-brand text-white mb-6 p-6 md:p-10 flex flex-col items-center text-center gap-3">
        <Image
          src="/images/logo1.png"
          alt="TeachStack illustration"
          width={80}
          height={80}
          className="animate-float object-contain"
          priority
        />
        <h1 className="text-2xl md:text-4xl font-bold leading-tight">ត្រៀមប្រឡង</h1>
        <p className="text-white/90 text-sm md:text-base max-w-[620px] leading-relaxed">
          ប្រព័ន្ធសាកល្បងចំណេះដឹង សម្រាប់ត្រៀមប្រឡងចូលក្រសួង និងស្ថាប័នរដ្ឋ។
        </p>
      </section>

      <section className="flex items-end justify-between mb-4" id="categories">
        <div>
          <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">ជ្រើសរើសប្រភេទ</p>
          <h2 className="text-xl md:text-2xl font-bold">វិញ្ញាសាប្រភេទក្រសួង</h2>
        </div>
      </section>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </>
  );
}
