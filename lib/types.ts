export interface Question {
  text: string;
  options: string[];
  tags?: string[];
  answer: number;
}

export interface ExamCategory {
  id: string;
  title: string;
  shortTitle: string;
  image: string;
  color: string;
  description: string;
  questions: Question[];
}

export interface ExamType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface SubTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface QuizResult {
  id?: string;
  userId?: string;
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
  timeSpent?: number;
}
