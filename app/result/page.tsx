"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Question, examTypes } from "@/lib/data";
import {
  RotateCcw,
  Home,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Trophy,
  ArrowRight
} from "lucide-react";

interface QuizResult {
  categoryId: string;
  typeId: string;
  rawTypeId?: string;
  rawLevelId?: string;
  rawSetId?: string;
  correct: number;
  total: number;
  questions: Question[];
  answers: (number | null)[];
  completedAt: string;
}

export default function ResultPage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const lastResult = localStorage.getItem("TeachStackResult");
    if (lastResult) {
      setResult(JSON.parse(lastResult));
    }
  }, []);

  if (!result) {
    return (
      <>
        <Topbar />
        <div className="text-center p-10 bg-surface border border-line rounded-brand">
          <AlertCircle className="mx-auto text-muted mb-4" size={48} />
          <h1 className="text-xl font-bold mb-2">មិនមានលទ្ធផល</h1>
          <p className="text-muted mb-6">សូមសាកល្បងអនុវត្តវិញ្ញាសាជាមុនសិន។</p>
          <Link
            href="/"
            className="primary-action w-full"
          >
            <Home size={20} />
            ទៅទំព័រដើម
          </Link>
        </div>
      </>
    );
  }

  const percent = Math.round((result.correct / result.total) * 100);
  let feedbackTitle = "សូមព្យាយាមបន្ថែម";
  let feedbackMessage = "លទ្ធផលនេះជាការហាត់សាកល្បង។ សូមរំលឹកមេរៀន រួចសាកល្បងម្តងទៀត។";
  
  if (percent >= 80) {
    feedbackTitle = "ល្អណាស់!";
    feedbackMessage = "អ្នកបានឆ្លើយត្រឹមត្រូវភាគច្រើន។ បន្តហាត់បន្ថែមដើម្បីរក្សាលទ្ធផលនេះ។";
  } else if (percent >= 50) {
    feedbackTitle = "លទ្ធផលល្អ";
    feedbackMessage = "អ្នកមានមូលដ្ឋានល្អហើយ។ ពិនិត្យមេរៀនបន្ថែម នឹងធ្វើបានកាន់តែប្រសើរ។";
  }

  const selectedType = examTypes.find(t => t.id === result.typeId);
  const currentSetNum = result.rawSetId ? parseInt(result.rawSetId.replace("set-", "")) : null;

  return (
    <>
      <Topbar />

      <div className="bg-surface border border-line rounded-brand p-8 text-center mb-[14px] relative overflow-hidden">
        <div 
          className="w-36 h-36 rounded-full flex items-center justify-center mx-auto mb-6 relative"
          style={{ 
            background: `conic-gradient(var(--color-green-brand) ${percent * 3.6}deg, var(--line) 0deg)`,
          }}
        >
          <div className="absolute inset-2 bg-surface rounded-full flex flex-col items-center justify-center">
            <strong className="text-3xl font-bold leading-none">{percent}%</strong>
            <span className="text-[11px] text-muted font-bold mt-1 uppercase tracking-wider">ពិន្ទុសរុប</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-1.5 text-ink">{feedbackTitle}</h1>
        <p className="text-muted text-sm leading-relaxed max-w-[280px] mx-auto mb-4">{feedbackMessage}</p>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
          <Trophy size={14} />
          {selectedType?.title || "វិញ្ញាសាទូទៅ"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-surface border border-line rounded-brand p-4 text-center">
          <span className="text-muted text-[11px] font-bold block mb-1">ត្រឹមត្រូវ</span>
          <strong className="text-green-brand text-xl block leading-tight">{result.correct}</strong>
        </div>
        <div className="bg-surface border border-line rounded-brand p-4 text-center">
          <span className="text-muted text-[11px] font-bold block mb-1">សរុប</span>
          <strong className="text-ink text-xl block leading-tight">{result.total}</strong>
        </div>
        <div className="bg-surface border border-line rounded-brand p-4 text-center">
          <span className="text-muted text-[11px] font-bold block mb-1">ខុស</span>
          <strong className="text-red-brand text-xl block leading-tight">{result.total - result.correct}</strong>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mb-8">
        {currentSetNum && currentSetNum < 20 && (
          <Link
            href={`/quiz/${result.categoryId}?type=${result.rawTypeId}&level=${result.rawLevelId}&set=set-${currentSetNum + 1}`}
            className="primary-action shadow-lg shadow-primary/20"
          >
            បន្តទៅវិញ្ញាសាបន្ទាប់
            <ArrowRight size={20} />
          </Link>
        )}

        <Link
          href={`/quiz/${result.categoryId}?type=${result.rawTypeId || ""}&level=${result.rawLevelId || ""}&set=${result.rawSetId || ""}`}
          className={currentSetNum && currentSetNum < 20 ? "secondary-action" : "primary-action shadow-lg shadow-primary/20"}
        >
          <RotateCcw size={20} />
          ធ្វើតេស្តម្តងទៀត
        </Link>
        
        <Link
          href={`/category/${result.categoryId}`}
          className="secondary-action"
        >
          ជ្រើសរើសប្រភេទផ្សេង
        </Link>
      </div>

      <div className="mb-10">
        <button 
          onClick={() => setShowReview(!showReview)}
          className="w-full flex items-center justify-center gap-2 text-primary font-bold py-2 hover:bg-primary/5 rounded-brand transition-colors border border-dashed border-primary/30"
        >
          {showReview ? <EyeOff size={18} /> : <Eye size={18} />}
          {showReview ? "លាក់ការពិនិត្យ" : "ពិនិត្យចម្លើយឡើងវិញ"}
        </button>

        {showReview && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-center font-bold text-lg mb-6">លម្អិតនៃចម្លើយ</h2>
            {result.questions.map((q, idx) => {
              const userAns = result.answers[idx];
              const isCorrect = userAns === q.answer;

              return (
                <div 
                  key={idx}
                  className="bg-surface p-5 rounded-[12px] border-l-[5px] shadow-sm border border-line"
                  style={{ borderLeftColor: isCorrect ? 'var(--color-green-brand)' : 'var(--color-red-brand)' }}
                >
                  <p className="font-bold mb-4 leading-relaxed text-ink">
                    {idx + 1}. {q.text}
                  </p>
                  
                  <div className="space-y-2.5">
                    {!isCorrect && (
                      <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-brand flex gap-2.5 items-start">
                        <X className="shrink-0 mt-0.5" size={16} />
                        <div className="text-sm">
                          <span className="font-bold">ចម្លើយរបស់អ្នក៖</span> {userAns !== null ? q.options[userAns] : "មិនបានឆ្លើយ"}
                        </div>
                      </div>
                    )}
                    <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-brand flex gap-2.5 items-start">
                      <Check className="shrink-0 mt-0.5" size={16} />
                      <div className="text-sm">
                        <span className="font-bold">ចម្លើយត្រឹមត្រូវ៖</span> {q.options[q.answer]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
