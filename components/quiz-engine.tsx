"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamCategory, Question, ExamType, SubTopic } from "@/lib/types";
import { ChevronRight, Send, X, CheckCircle2, AlertCircle, Timer, Award } from "lucide-react";

interface QuizEngineProps {
  category: ExamCategory;
  examTypes: ExamType[];
  subTopicData: Record<string, SubTopic[]>;
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

export function QuizEngine({ category, examTypes, subTopicData }: QuizEngineProps) {
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
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes default
  const [isFinished, setIsFinished] = useState(false);

  // Initialize Quiz
  useEffect(() => {
    // Filter questions based on tags
    console.log(`[QuizEngine] Processing pool of ${category.questions.length} questions. Filters: type=${typeId}, level=${levelId}`);
    
    const filteredPool = category.questions.filter((q) => {
      if (!q.tags || q.tags.length === 0) {
        return typeId === "general" || typeId === "mixed";
      }
      
      if (typeId === "general" || typeId === "mixed") return true;
      
      const hasType = q.tags.includes(typeId);
      const hasLevel = !levelId || q.tags.includes(levelId);
      
      return hasType && hasLevel;
    });

    console.log(`[QuizEngine] Filtered pool size: ${filteredPool.length}`);

    // CRITICAL: If filtering by tags results in 0 questions, fall back to ALL questions
    // in that category so the user doesn't see an empty screen.
    const pool = filteredPool.length > 0 ? filteredPool : category.questions;
    if (filteredPool.length === 0) {
      console.warn(`[QuizEngine] Filtering returned 0 questions. Falling back to full pool of ${category.questions.length}.`);
    }
    
    // Logic for Sets: Deterministic selection if possible
    let finalQuestions: Question[] = [];
    if (setId && setId.startsWith("set-")) {
      const setNum = parseInt(setId.replace("set-", ""), 10);
      const startIdx = (setNum - 1) * 20;
      
      if (pool.length > startIdx) {
        finalQuestions = pool.slice(startIdx, startIdx + 20);
        console.log(`[QuizEngine] Loading Set ${setNum} (Questions ${startIdx + 1} to ${Math.min(startIdx + 20, pool.length)})`);
      } else {
        finalQuestions = shuffleQuizQuestions(pool).slice(0, 20);
        console.log(`[QuizEngine] Set ${setNum} out of range. Loading 20 random questions.`);
      }
    } else {
      finalQuestions = shuffleQuizQuestions(pool).slice(0, 20);
      console.log(`[QuizEngine] No set specified. Loading ${finalQuestions.length} random questions.`);
    }

    setShuffledQuestions(finalQuestions);
    setSelectedAnswers(new Array(finalQuestions.length).fill(null));
    setTimeLeft(finalQuestions.length * 60); // 1 minute per question
    setIsLoading(false);
  }, [category, typeId, levelId, setId]);

  // Timer logic
  useEffect(() => {
    if (isLoading || isFinished || showExitConfirm) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit would go here, but for now we just let it hit 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, isFinished, showExitConfirm]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (optionIdx: number) => {
    if (selectedAnswers[currentIdx] !== null) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIdx] = optionIdx;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = useCallback(() => {
    setIsFinished(true);
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
      timeSpent: (shuffledQuestions.length * 60) - timeLeft
    };

    localStorage.setItem("TeachStackResult", JSON.stringify(result));
    router.push("/result");
  }, [category.id, levelId, router, selectedAnswers, setId, shuffledQuestions, timeLeft, typeId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center animate-pulse">
          <p className="text-lg font-bold text-primary mb-1">កំពុងរៀបចំវិញ្ញាសា...</p>
          <p className="text-sm text-muted">សូមរង់ចាំមួយភ្លែត</p>
        </div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center p-10 bg-surface border border-line rounded-brand shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2 text-ink">មិនមានសំណួរសម្រាប់វិញ្ញាសានេះទេ</h2>
        <p className="text-muted mb-6">សូមសាកល្បងជ្រើសរើសប្រភេទវិញ្ញាសាផ្សេងទៀត។</p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-white px-8 py-3 rounded-brand font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all"
        >
          ត្រឡប់ទៅទំព័រដើម
        </button>
      </div>
    );
  }

  const progress = ((currentIdx + 1) / shuffledQuestions.length) * 100;
  
  // Dynamic Title Logic
  let displayTitle = "វិញ្ញាសា";
  const selectedType = examTypes.find(t => t.id === typeId);
  const selectedSubTopic = levelId && subTopicData[levelId]?.find(st => st.id === typeId);
  
  if (setId?.startsWith("set-")) {
    displayTitle = `វិញ្ញាសាទី ${setId.replace("set-", "")}`;
  } else if (selectedSubTopic) {
    displayTitle = selectedSubTopic.title;
  } else if (selectedType) {
    displayTitle = selectedType.title;
  }

  const currentQuestion = shuffledQuestions[currentIdx];
  const hasAnswered = selectedAnswers[currentIdx] !== null;

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Quiz Top Bar */}
      <div className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md pb-4 pt-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 bg-paper rounded-xl shadow-sm border border-line p-2">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <h2 className="text-primary font-bold text-sm leading-tight line-clamp-1">
                {displayTitle}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-muted font-bold flex items-center gap-1">
                  <Award size={12} className="text-yellow-500" />
                  សំណួរ {currentIdx + 1}/{shuffledQuestions.length}
                </span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-muted"}`}>
                  <Timer size={12} />
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="w-10 h-10 flex items-center justify-center border border-red-100 text-red-500 rounded-xl bg-red-50/50 hover:bg-red-50 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar with target dots */}
        <div className="relative h-2 bg-line rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 py-4">
        {/* Question Card */}
        <div className="animate-enter bg-surface border border-line rounded-2xl p-6 mb-6 shadow-sm min-h-[160px] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50"></div>
          <span className="text-[11px] text-primary font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
              {currentIdx + 1}
            </span>
            សំណួរទី {currentIdx + 1}
          </span>
          <p className="text-xl font-bold leading-relaxed text-ink md:text-2xl">
            {currentQuestion.text}
          </p>
        </div>

        {/* Options */}
        <div className="grid gap-4 mb-8">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIdx] === idx;
            const isCorrect = idx === currentQuestion.answer;
            
            let stateClass = "bg-surface border-line hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]";
            
            if (hasAnswered) {
              if (isCorrect) {
                stateClass = "bg-green-50 border-green-500 text-green-800 ring-2 ring-green-500/10 scale-[1.02]";
              } else if (isSelected) {
                stateClass = "bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/10";
              } else {
                stateClass = "bg-surface border-line opacity-50 grayscale-[0.5]";
              }
            } else if (isSelected) {
              stateClass = "bg-primary/5 border-primary text-primary font-bold ring-2 ring-primary/20 scale-[1.01]";
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex gap-4 items-center group relative overflow-hidden ${stateClass}`}
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div
                  className={`w-9 h-9 rounded-lg border-2 shrink-0 flex items-center justify-center text-sm font-black transition-all ${
                    hasAnswered && isCorrect ? "bg-green-500 text-white border-green-500 shadow-md rotate-[360deg]" :
                    hasAnswered && isSelected ? "bg-red-500 text-white border-red-500" :
                    isSelected ? "bg-primary text-white border-primary shadow-md" : 
                    "border-line text-muted bg-paper group-hover:border-primary/50 group-hover:text-primary"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-[16px] md:text-[17px] leading-snug flex-1 font-medium">{option}</span>
                
                {hasAnswered && isCorrect && (
                   <CheckCircle2 size={24} className="text-green-500 absolute right-4 animate-in zoom-in" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                   <AlertCircle size={24} className="text-red-500 absolute right-4 animate-in zoom-in" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {hasAnswered && (
          <div className={`animate-enter mb-8 p-5 rounded-2xl flex flex-col gap-2 border-2 ${
            selectedAnswers[currentIdx] === currentQuestion.answer 
              ? "bg-green-50/50 border-green-200 text-green-800" 
              : "bg-red-50/50 border-red-200 text-red-800"
          }`}>
            <div className="flex items-center gap-3">
              {selectedAnswers[currentIdx] === currentQuestion.answer ? (
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                  <AlertCircle size={18} />
                </div>
              )}
              <span className="font-black text-lg">
                {selectedAnswers[currentIdx] === currentQuestion.answer ? "អបអរសាទរ! ត្រឹមត្រូវ" : "សោកស្តាយ! មិនត្រឹមត្រូវទេ"}
              </span>
            </div>
            
            {selectedAnswers[currentIdx] !== currentQuestion.answer && (
              <div className="mt-2 pl-11">
                <p className="text-sm opacity-80 mb-1 font-medium text-ink/70">ចម្លើយត្រឹមត្រូវគឺ៖</p>
                <p className="text-[15px] font-bold text-green-700 bg-green-100/50 p-2 px-3 rounded-lg border border-green-200 inline-block">
                  {currentQuestion.options[currentQuestion.answer]}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="sticky bottom-0 pb-6 pt-2 bg-paper/80 backdrop-blur-md">
        {currentIdx === shuffledQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswered || isFinished}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-black flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98] shadow-lg shadow-green-500/20"
          >
            <span>បញ្ចប់ និងមើលលទ្ធផល</span>
            <Send size={20} className="animate-pulse" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className="w-full h-14 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-black flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] shadow-lg shadow-primary/20 group"
          >
            <span>សំណួរបន្ទាប់</span>
            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-paper w-full max-w-[360px] rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 border border-line">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-ink mb-3 text-center">ចាកចេញពីការប្រឡង?</h3>
            <p className="text-muted text-center text-[15px] mb-8 leading-relaxed">
              លទ្ធផលដែលអ្នកបានធ្វើកន្លងមកនឹងមិនត្រូវបានរក្សាទុកឡើយ។ តើអ្នកពិតជាចង់ចាកចេញមែនទេ?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="h-13 rounded-xl font-bold border-2 border-line text-ink hover:bg-surface transition-all active:scale-95"
              >
                បន្តធ្វើតេស្ត
              </button>
              <button 
                onClick={() => router.back()}
                className="h-13 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                ចាកចេញ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
