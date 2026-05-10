import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { getCategoryById, getExamTypes, getSubTopicData } from "@/lib/api";
import { ChevronRight, ArrowLeft, RefreshCw } from "lucide-react";
import { ExamType, SubTopic } from "@/lib/types";

type DisplayItem = (ExamType | SubTopic) & {
  color?: string;
};

function getDisplayColor(item: DisplayItem, fallback: string) {
  return typeof item.color === "string" ? item.color : fallback;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; topic?: string }>;
}) {
  const { id } = await params;
  const { type, topic } = await searchParams;
  
  // Fetch all necessary data in parallel
  const [category, examTypesResponse, subTopicDataResponse] = await Promise.all([
    getCategoryById(id),
    getExamTypes(),
    getSubTopicData()
  ]);

  const examTypes = examTypesResponse || [];
  const subTopicData = subTopicDataResponse || {};

  if (!category) {
    notFound();
  }

  const isExamSet = !!topic;
  const isSubTopic = type && subTopicData[type] && !topic;
  const questions = category.questions || [];

  const matchesSelection = (questionTags: string[] | undefined, itemId?: string, levelId?: string) => {
    if (!questionTags || questionTags.length === 0) {
      return itemId === "general" || itemId === "mixed";
    }

    if (!itemId || itemId === "general") return true;

    if (itemId === "mixed") {
      if (!levelId) return true;
      const allowedTags = (subTopicData[levelId] || []).map((subTopic) => subTopic.id);
      return questionTags.some((tag) => allowedTags.includes(tag));
    }

    return questionTags.includes(itemId) && (!levelId || questionTags.includes(levelId));
  };

  const selectedQuestionCount = isExamSet
    ? questions.filter((question) => matchesSelection(question.tags, topic, type)).length
    : questions.length;

  // Determine header info
  let headerTitle = category.title;
  let headerDesc = category.description;
  let headerColor = category.color;
  let headerIconHtml = (
    <Image 
      src={category.image} 
      alt={category.title} 
      width={60} 
      height={60} 
      className="object-contain" 
    />
  );

  if (isExamSet) {
    const currentTopic = [...examTypes, ...Object.values(subTopicData).flat()].find(t => t.id === topic);
    if (currentTopic) {
      headerTitle = currentTopic.title;
      headerDesc = currentTopic.description;
      headerColor = getDisplayColor(currentTopic, headerColor);
      headerIconHtml = <i className={`${currentTopic.icon} text-[36px]`} style={{ color: headerColor }}></i>;
    }
  } else if (type) {
    const currentType = examTypes.find(t => t.id === type);
    if (currentType) {
      headerTitle = currentType.title;
      headerDesc = currentType.description;
      headerColor = currentType.color || headerColor;
      headerIconHtml = <i className={`${currentType.icon} text-[36px]`} style={{ color: headerColor }}></i>;
    }
  }

  // Determine display data
  let displayData: DisplayItem[] = [];
  if (isExamSet) {
    const setCount = Math.ceil(selectedQuestionCount / 20);

    for (let i = 1; i <= setCount; i++) {
      displayData.push({
        id: `set-${i}`,
        title: `វិញ្ញាសាទី ${i}`,
        description: `អនុវត្តវិញ្ញាសាទី ${i} សម្រាប់${headerTitle}`,
        icon: "fa-solid fa-file-lines",
      });
    }
  } else if (isSubTopic) {
    displayData = subTopicData[type!] || [];
  } else {
    displayData = examTypes;
  }

  // Question count logic
  const getQuestionCount = (item: DisplayItem) => {
    if (isExamSet) return null;
    if (!item.id) return 0;

    return questions.filter((question) =>
      matchesSelection(question.tags, item.id, isSubTopic ? type : undefined)
    ).length;
  };

  // Back button logic
  let backHref = "/";
  let backText = "ត្រឡប់ទៅទំព័រដើម";
  
  if (isExamSet) {
    backHref = `/category/${id}?type=${type}`;
    backText = `ត្រឡប់ទៅកាន់ ${examTypes.find(t => t.id === type)?.title || "ប្រភេទវិញ្ញាសា"}`;
  } else if (isSubTopic) {
    backHref = `/category/${id}`;
    backText = "ត្រឡប់ទៅកាន់ប្រភេទវិញ្ញាសា";
  }

  return (
    <>
      <Topbar />

      <div 
        className="animate-enter flex items-center gap-4 border rounded-brand p-[18px] mb-2 shadow-sm"
        style={{ 
          backgroundColor: `${headerColor}26`, 
          borderColor: `${headerColor}80`,
        }}
      >
        <div 
          className="bg-paper p-3 rounded-[12px] shadow-sm flex items-center justify-center shrink-0 border"
          style={{ borderColor: `${headerColor}33` }}
        >
          {headerIconHtml}
        </div>
        <div>
          <h2 className="text-[1.25rem] font-bold m-0 leading-[1.4]" style={{ color: headerColor }}>
            {headerTitle}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-muted text-[0.95rem] m-0 leading-[1.5]">
              {headerDesc}
            </p>
            {questions.length > 0 ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                {questions.length} សំណួរសរុប
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                0 សំណួរ
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="flex items-end justify-between mb-4 mt-6">
        <div>
          <p className="text-muted text-xs font-bold uppercase tracking-wider mb-1">ជ្រើសរើសវិញ្ញាសា</p>
          <h2 className="text-xl md:text-2xl font-bold">
            {isExamSet ? headerTitle : isSubTopic ? (examTypes.find(t => t.id === type)?.title || "វិញ្ញាសា") : "ប្រភេទវិញ្ញាសា"}
          </h2>
        </div>
      </section>

      {displayData.length === 0 && (
        <div className="bg-surface border border-dashed border-line rounded-brand p-12 text-center animate-enter flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center text-muted">
            <RefreshCw size={32} />
          </div>
          <div>
            <h3 className="font-bold text-ink mb-1">មិនមានវិញ្ញាសានៅឡើយទេ</h3>
            <p className="text-muted text-sm max-w-[300px] mx-auto">
              ប្រសិនបើអ្នកទើបតែបញ្ចូលទិន្នន័យទៅ Firebase សូមព្យាយាម Refresh ទំព័រនេះម្តងទៀត។
            </p>
          </div>
          <Link href="/" className="bg-primary text-white px-6 py-2 rounded-brand font-bold hover:brightness-105 transition-all mt-2">
            ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
      )}

      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(isExamSet || isSubTopic) && (
          <Link 
            href={backHref}
            className="animate-enter bg-surface border border-line rounded-brand flex items-center gap-4 p-3.5 transition-all hover:shadow-brand hover:-translate-y-0.5"
            style={{ borderColor: `${category.color}60` }}
          >
            <span 
              className="w-11 h-11 rounded-brand flex items-center justify-center text-white shrink-0"
              style={{ background: category.color }}
            >
              <ArrowLeft size={20} />
            </span>
            <div>
              <h3 className="font-bold text-[15px] mb-0.5" style={{ color: category.color }}>ត្រឡប់ក្រោយ</h3>
              <p className="m-0 text-muted text-xs leading-tight">{backText}</p>
            </div>
          </Link>
        )}

        {displayData.map((item, index) => {
          const nextHref = isExamSet
            ? `/quiz/${id}?type=${topic}&level=${type}&set=${item.id}`
            : subTopicData[item.id]
              ? `/category/${id}?type=${item.id}`
              : item.id === "mixed"
                ? `/quiz/${id}?type=${item.id}&level=${type || ""}`
                : `/category/${id}?type=${type || item.id}&topic=${item.id}`;

          const itemColor = item.color || headerColor || "var(--primary)";
          const qCount = getQuestionCount(item);
          const delay = (0.1 + (index * 0.05)) + "s";

          return (
            <Link 
              key={item.id}
              href={nextHref}
              className="animate-enter bg-surface border border-line rounded-brand flex items-center gap-4 p-3.5 transition-all hover:shadow-brand hover:-translate-y-0.5"
              style={{ 
                borderColor: `${itemColor}80`, 
                animationDelay: delay
              }}
            >
              <span 
                className="w-11 h-11 rounded-brand flex items-center justify-center text-xl shrink-0"
                style={{ 
                  backgroundColor: `${itemColor}33`, 
                  color: itemColor,
                }}
              >
                <i className={item.icon}></i>
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-[15px] mb-0.5 leading-tight" style={{ color: itemColor }}>{item.title}</h3>
                  {qCount !== null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
                      qCount > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-muted/10 text-muted border-muted/20"
                    }`}>
                      {qCount} សំណួរ
                    </span>
                  )}
                </div>
                <p className="m-0 text-muted text-[11px] leading-tight line-clamp-2">{item.description}</p>
              </div>
              <ChevronRight size={18} style={{ color: itemColor, opacity: 0.9 }} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
