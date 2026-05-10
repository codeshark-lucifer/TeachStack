"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { QuizResult } from "@/lib/types";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Home,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";

export default function ResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [examTypes, setExamTypes] = useState<any[]>([]);

  useEffect(() => {
    const lastResult = localStorage.getItem("TeachStackResult");
    if (lastResult) {
      setResult(JSON.parse(lastResult));
    }
    
    // Fetch exam types for display
    import("@/lib/api").then(api => {
      api.getExamTypes().then(setExamTypes);
    });
  }, []);

  // ... (rest of the component)

  // --------------------------------------------------------------------------
  // Empty State
  // --------------------------------------------------------------------------
  if (!result) {
    return (
      <>
        <Topbar />

        <div className="rounded-brand border border-line bg-surface p-10 text-center">
          <AlertCircle className="mx-auto mb-4 text-muted" size={48} />

          <h1 className="mb-2 text-xl font-bold text-ink">មិនមានលទ្ធផល</h1>

          <p className="mb-6 text-sm text-muted">
            សូមសាកល្បងអនុវត្តវិញ្ញាសាជាមុនសិន។
          </p>

          <Link href="/" className="primary-action mx-auto w-full max-w-sm">
            <Home size={20} />
            <span>ទៅទំព័រដើម</span>
          </Link>
        </div>
      </>
    );
  }

  // --------------------------------------------------------------------------
  // Calculations
  // --------------------------------------------------------------------------
  const percent =
    result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  const wrong = result.total - result.correct;

  let feedbackTitle = "សូមព្យាយាមបន្ថែម";
  let feedbackMessage =
    "លទ្ធផលនេះជាការហាត់សាកល្បង។ សូមរំលឹកមេរៀន រួចសាកល្បងម្តងទៀត។";

  if (percent >= 80) {
    feedbackTitle = "ល្អណាស់!";
    feedbackMessage =
      "អ្នកបានឆ្លើយត្រឹមត្រូវភាគច្រើន។ បន្តហាត់បន្ថែមដើម្បីរក្សាលទ្ធផលនេះ។";
  } else if (percent >= 50) {
    feedbackTitle = "លទ្ធផលល្អ";
    feedbackMessage =
      "អ្នកមានមូលដ្ឋានល្អហើយ។ ពិនិត្យមេរៀនបន្ថែម នឹងធ្វើបានកាន់តែប្រសើរ។";
  }

  const selectedType = examTypes.find((t) => t.id === result.typeId);

  const currentSetNum = result.rawSetId
    ? parseInt(result.rawSetId.replace("set-", ""), 10)
    : null;

  const hasNextSet = currentSetNum !== null && currentSetNum < 20;

  const retryHref = `/quiz/${result.categoryId}?type=${
    result.rawTypeId || ""
  }&level=${result.rawLevelId || ""}&set=${result.rawSetId || ""}`;

  const nextHref = hasNextSet
    ? `/quiz/${result.categoryId}?type=${result.rawTypeId}&level=${
        result.rawLevelId
      }&set=set-${currentSetNum! + 1}`
    : "";

  // --------------------------------------------------------------------------
  // UI
  // --------------------------------------------------------------------------
  return (
    <>
      <Topbar />

      {/* Result Hero */}
      <section className="relative mb-4 overflow-hidden rounded-brand border border-line bg-surface p-8 text-center">
        {/* Progress Circle */}
        <div
          className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-green-brand) ${
              percent * 3.6
            }deg, var(--line) 0deg)`,
          }}
        >
          <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-surface">
            <strong className="text-3xl font-bold leading-none text-ink">
              {percent}%
            </strong>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">
              ពិន្ទុសរុប
            </span>
          </div>
        </div>

        {/* Feedback */}
        <h1 className="mb-2 text-2xl font-bold text-ink">{feedbackTitle}</h1>

        <p className="mx-auto mb-4 max-w-xs text-sm leading-relaxed text-muted">
          {feedbackMessage}
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
          <Trophy size={14} />
          <span>{selectedType?.title || "វិញ្ញាសាទូទៅ"}</span>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-6 grid grid-cols-3 gap-3">
        <StatCard
          label="ត្រឹមត្រូវ"
          value={result.correct}
          valueClass="text-green-brand"
        />

        <StatCard label="សរុប" value={result.total} valueClass="text-ink" />

        <StatCard label="ខុស" value={wrong} valueClass="text-red-brand" />
      </section>

      {/* Actions */}
      <section className="mb-8 flex flex-col gap-3">
        {hasNextSet && (
          <Link
            href={nextHref}
            className="
        group relative overflow-hidden
        flex items-center justify-center gap-2
        rounded-2xl
        bg-gradient-to-r from-primary to-primary/90
        px-5 py-4
        font-bold text-white
        shadow-lg shadow-primary/25
        ring-1 ring-primary/20
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-xl hover:shadow-primary/30
        active:translate-y-0 active:scale-[0.99]
      "
          >
            {/* Shine Effect */}
            <span
              className="
          absolute inset-0
          -translate-x-full
          bg-gradient-to-r from-transparent via-white/20 to-transparent
          transition-transform duration-700
          group-hover:translate-x-full
        "
            />

            <span className="relative z-10">បន្តទៅវិញ្ញាសាបន្ទាប់</span>
            <ArrowRight
              size={20}
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}

        <Link
          href={retryHref}
          className={
            hasNextSet
              ? `
          group flex items-center justify-center gap-2
          rounded-2xl
          border border-line
          bg-surface
          px-5 py-4
          font-semibold text-ink
          shadow-sm
          transition-all duration-300
          hover:border-primary/30
          hover:bg-primary/5
          hover:text-primary
          hover:shadow-md
          active:scale-[0.99]
        `
              : `
          group relative overflow-hidden
          flex items-center justify-center gap-2
          rounded-2xl
          bg-gradient-to-r from-primary to-primary/90
          px-5 py-4
          font-bold text-white
          shadow-lg shadow-primary/25
          ring-1 ring-primary/20
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-xl hover:shadow-primary/30
          active:translate-y-0 active:scale-[0.99]
        `
          }
        >
          <RotateCcw
            size={20}
            className="transition-transform duration-300 group-hover:-rotate-90"
          />
          <span>ធ្វើតេស្តម្តងទៀត</span>
        </Link>

        <Link
          href={`/category/${result.categoryId}`}
          className="
      group flex items-center justify-center gap-2
      rounded-2xl
      border border-line
      bg-surface
      px-5 py-4
      font-semibold text-ink
      shadow-sm
      transition-all duration-300
      hover:border-primary/30
      hover:bg-primary/5
      hover:text-primary
      hover:shadow-md
      active:scale-[0.99]
    "
        >
          <span>ជ្រើសរើសប្រភេទផ្សេង</span>
        </Link>
      </section>

      {/* Review */}
      <section className="mb-10">
        <button
          type="button"
          onClick={() => setShowReview((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2 rounded-brand border border-dashed border-primary/30 py-2 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          {showReview ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{showReview ? "លាក់ការពិនិត្យ" : "ពិនិត្យចម្លើយឡើងវិញ"}</span>
        </button>

        {showReview && (
          <div className="mt-6 animate-in fade-in slide-in-from-top-4 space-y-4 duration-300">
            <h2 className="mb-6 text-center text-lg font-bold text-ink">
              លម្អិតនៃចម្លើយ
            </h2>

            {result.questions.map((q, idx) => {
              const userAns = result.answers[idx];
              const isCorrect = userAns === q.answer;

              return (
                <article
                  key={idx}
                  className="rounded-[12px] border border-line bg-surface p-5 shadow-sm"
                  style={{
                    borderLeftWidth: "5px",
                    borderLeftColor: isCorrect
                      ? "var(--color-green-brand)"
                      : "var(--color-red-brand)",
                  }}
                >
                  {/* Question */}
                  <p className="mb-4 font-bold leading-relaxed text-ink">
                    {idx + 1}. {q.text}
                  </p>

                  <div className="space-y-3">
                    {/* User Answer (only when wrong) */}
                    {!isCorrect && (
                      <div className="flex items-start gap-2.5 rounded-brand border border-red-100 bg-red-50 p-3 text-red-700">
                        <X className="mt-0.5 shrink-0" size={16} />
                        <div className="text-sm leading-relaxed">
                          <span className="font-bold">ចម្លើយរបស់អ្នក៖</span>{" "}
                          {userAns !== null
                            ? q.options[userAns]
                            : "មិនបានឆ្លើយ"}
                        </div>
                      </div>
                    )}

                    {/* Correct Answer */}
                    <div className="flex items-start gap-2.5 rounded-brand border border-green-100 bg-green-50 p-3 text-green-700">
                      <Check className="mt-0.5 shrink-0" size={16} />
                      <div className="text-sm leading-relaxed">
                        <span className="font-bold">ចម្លើយត្រឹមត្រូវ៖</span>{" "}
                        {q.options[q.answer]}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

// --------------------------------------------------------------------------
// Reusable Stat Card
// --------------------------------------------------------------------------
function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-brand border border-line bg-surface p-4 text-center">
      <span className="mb-1 block text-[11px] font-bold text-muted">
        {label}
      </span>
      <strong
        className={`block text-xl font-bold leading-tight ${valueClass || "text-ink"}`}
      >
        {value}
      </strong>
    </div>
  );
}
