import { notFound } from "next/navigation";
import { getCategoryById, getQuestionsByCategoryId, getExamTypes, getSubTopicData } from "@/lib/api";
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

  const [examTypes, subTopicData] = await Promise.all([
    getExamTypes(),
    getSubTopicData()
  ]);

  return <QuizEngine category={category} examTypes={examTypes} subTopicData={subTopicData} />;
}
