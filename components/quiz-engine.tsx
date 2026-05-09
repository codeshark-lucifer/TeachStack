"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamCategory, Question, examTypes } from "@/lib/data";
import { ChevronRight, ChevronLeft, Send, Home, X, CheckCircle2, AlertCircle } from "lucide-react";

interface QuizEngineProps {
  category: ExamCategory;
}

function shuffleItems<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function shuffleQuizQuestions(items: Question[]): Question[] {
  return shuffleItems(items).map((question) => {
    const optionsWithStatus = question.options.map((option, index) => ({
      option,
      isCorrect: index === question.answer,
    }));
    const shuffledOptions = shuffleItems(optionsWithStatus);

    return {
      ...question,
      options: shuffledOptions.map((item) => item.option),
      answer: shuffledOptions.findIndex((item) => item.isCorrect),
    };
  });
}

export function QuizEngine({ category }: QuizEngineProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const typeId = searchParams.get("type") || "general";
  const levelId = searchParams.get("level");
  const setId = searchParams.get("set");

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    // Filter questions based on tags
    const filteredPool = category.questions.filter((q) => {
      if (!q.tags) return false;
      if (typeId === "general" || typeId === "mixed") return true;
      const matchType = q.tags.includes(typeId);
      const matchLevel = !levelId || q.tags.includes(levelId);
      return matchType && matchLevel;
    });

    const pool = filteredPool.length > 0 ? filteredPool : category.questions;
    const shuffled = shuffleQuizQuestions(pool);
    const finalQuestions = shuffled.slice(0, 20);

    setShuffledQuestions(finalQuestions);
    setSelectedAnswers(new Array(finalQuestions.length).fill(null));
    setIsLoading(false);
  }, [category, typeId, levelId]);

  const currentQuestion = shuffledQuestions[currentIdx];
  const hasAnswered = selectedAnswers[currentIdx] !== null;

  const handleSelect = (optionIdx: number) => {
    if (hasAnswered) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIdx] = optionIdx;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = () => {
    const correct = shuffledQuestions.reduce((acc, q, idx) => {
      if (selectedAnswers[idx] === q.answer) return acc + 1;
      return acc;
    }, 0);

    const result = {
      categoryId: category.id,
      typeId: typeId,
      rawTypeId: typeId,
      rawLevelId: levelId,
      rawSetId: setId,
      correct,
      total: shuffledQuestions.length,
      questions: shuffledQuestions,
      answers: selectedAnswers,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("TeachStackResult", JSON.stringify(result));
    router.push("/result");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted">កំពុងរៀបចំសំណួរ...</p>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center p-8 bg-surface border border-line rounded-brand">
        <h2 className="text-xl mb-4">មិនមានសំណួរសម្រាប់វិញ្ញាសានេះទេ</h2>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-white px-6 py-2 rounded-brand font-bold"
        >
          ត្រឡប់ទៅវិញ
        </button>
      </div>
    );
  }

  const progress = ((currentIdx + 1) / shuffledQuestions.length) * 100;
  const selectedType = examTypes.find(t => t.id === typeId) || examTypes[0];
  const setTitle = setId?.startsWith("set-") ? `វិញ្ញាសាទី ${setId.replace("set-", "")}` : selectedType.title;

  return (
    <div className="flex flex-col h-full">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-primary font-bold text-[13px] leading-tight">
              {setTitle}
            </h2>
            <span className="text-[11px] text-muted font-bold block mt-0.5">
              សំណួរ {currentIdx + 1}/{shuffledQuestions.length}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="w-9 h-9 flex items-center justify-center border border-red-200 text-red-500 rounded-brand bg-red-50/50 hover:bg-red-50"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-line rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-green-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-surface border border-line rounded-brand p-5 mb-6 shadow-sm min-h-[120px] flex flex-col justify-center">
        <span className="text-[11px] text-primary font-bold uppercase tracking-wider mb-2">សំណួរទី {currentIdx + 1}</span>
        <p className="text-lg font-medium leading-relaxed text-ink">
          {currentQuestion.text}
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedAnswers[currentIdx] === idx;
          const isCorrect = idx === currentQuestion.answer;
          
          let stateClass = "bg-surface border-line hover:border-primary/50";
          if (hasAnswered) {
            if (isCorrect) stateClass = "bg-green-50 border-green-brand text-green-700 ring-1 ring-green-brand/20";
            else if (isSelected) stateClass = "bg-red-50 border-red-brand text-red-700 ring-1 ring-red-brand/20";
            else stateClass = "bg-surface border-line opacity-60";
          } else if (isSelected) {
            stateClass = "bg-primary/5 border-primary text-primary font-semibold";
          }

          return (
            <button
              key={idx}
              disabled={hasAnswered}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-brand border transition-all flex gap-3 items-center group ${stateClass}`}
            >
              <div
                className={`w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${
                  hasAnswered && isCorrect ? "bg-green-brand text-white border-green-brand" :
                  hasAnswered && isSelected ? "bg-red-brand text-white border-red-brand" :
                  isSelected ? "bg-primary text-white border-primary" : "border-line text-muted"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-[15px] leading-snug flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {hasAnswered && (
        <div className={`animate-enter mb-6 p-4 rounded-brand flex items-center gap-3 border ${
          selectedAnswers[currentIdx] === currentQuestion.answer 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {selectedAnswers[currentIdx] === currentQuestion.answer ? (
            <>
              <CheckCircle2 size={20} />
              <span className="font-bold">ត្រឹមត្រូវ!</span>
            </>
          ) : (
            <>
              <AlertCircle size={20} />
              <div className="flex flex-col">
                <span className="font-bold">មិនត្រឹមត្រូវទេ</span>
                <span className="text-xs opacity-90">ចម្លើយត្រឹមត្រូវគឺ៖ {currentQuestion.options[currentQuestion.answer]}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto">
        {currentIdx === shuffledQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswered}
            className="w-full h-14 bg-green-brand text-white rounded-brand font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:brightness-110 shadow-lg shadow-green-brand/20"
          >
            បញ្ចប់ និងមើលលទ្ធផល
            <Send size={18} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="w-full h-14 bg-primary text-white rounded-brand font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:brightness-110 shadow-lg shadow-primary/20"
          >
            សំណួរបន្ទាប់
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-paper w-full max-w-[320px] rounded-[16px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-ink mb-2 text-center">ចាកចេញពីការប្រឡង?</h3>
            <p className="text-muted text-center text-sm mb-6 leading-relaxed">
              លទ្ធផលដែលអ្នកបានធ្វើកន្លងមកនឹងមិនត្រូវបានរក្សាទុកឡើយ។ តើអ្នកពិតជាចង់ចាកចេញមែនទេ?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="h-12 rounded-brand font-bold border border-line text-ink hover:bg-surface transition-colors"
              >
                ទេ
              </button>
              <button 
                onClick={() => router.back()}
                className="h-12 rounded-brand font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                បាទ ចាកចេញ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
