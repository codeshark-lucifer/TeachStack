import { notFound } from "next/navigation";
import { getCategoryById, getQuestionsByCategoryId } from "@/lib/api";
import { QuizEngine } from "@/components/quiz-engine";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  // If questions are missing from the category object, try fetching them separately
  if (!category.questions || category.questions.length === 0) {
    const questions = await getQuestionsByCategoryId(id);
    category.questions = questions;
  }

  return <QuizEngine category={category} />;
}
