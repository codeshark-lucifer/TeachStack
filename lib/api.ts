import { ExamCategory, Question, ExamType, SubTopic } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_SECRET = process.env.API_SECRET || "93be302a20343ee34f4049757949185554b479d6ff847766183412724981177d";

// Local image mapping for fallback or cleaning backend paths
const localImageMap: Record<string, string> = {
  education: "/images/education.png",
  health: "/images/health.png",
  interior: "/images/police.svg",
  civil: "/images/MSC.png",
  agriculture: "/images/MAFF.png",
};

/**
 * Ensures we always have an array even if Firebase returns an object with numeric/string keys
 */
function ensureArray<T>(data: any): T[] {
  if (!data || (typeof data === "object" && data.error)) return [];
  if (Array.isArray(data)) return data.filter(Boolean) as T[];
  if (typeof data === "object") return (Object.values(data).filter(Boolean) as unknown) as T[];
  return [];
}

function transformCategory(category: any): ExamCategory {
  if (!category) return {} as ExamCategory;

  let image = category.image || "";
  
  // Use local mapping if available for the ID
  if (localImageMap[category.id]) {
    image = localImageMap[category.id];
  } else if (image && !image.startsWith("/") && !image.startsWith("http")) {
    image = "/" + image.replace(/^assets\//, "");
  }

  return {
    ...category,
    image,
    color: category.color || "#3467d6",
    questions: ensureArray<Question>(category.questions),
  };
}

async function fetchWithAuth(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-token": API_SECRET,
        "Accept": "application/json",
      },
      // Disable caching for live data from Firebase
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<ExamCategory[]> {
  const data = await fetchWithAuth("/api/categories");
  if (!data) return [];
  
  const categories = ensureArray<any>(data);
  return categories.map(transformCategory);
}

export async function getCategoryById(id: string): Promise<ExamCategory | null> {
  const data = await fetchWithAuth(`/api/category/${id}`);
  if (!data) return null;
  
  const category = transformCategory(data);
  
  // FALLBACK: If questions are empty, try fetching them explicitly
  // Some Firebase structures might have them separated or the main GET didn't include them
  if (!category.questions || category.questions.length === 0) {
    const questions = await getQuestionsByCategoryId(id);
    if (questions && questions.length > 0) {
      category.questions = questions;
    }
  }
  
  return category;
}

export async function getQuestionsByCategoryId(id: string): Promise<Question[]> {
  const data = await fetchWithAuth(`/api/questions/${id}`);
  const questions = ensureArray<Question>(data);
  console.log(`[API] Fetched ${questions.length} questions for category: ${id}`);
  return questions;
}

export async function getExamTypes(): Promise<ExamType[]> {
  const data = await fetchWithAuth("/api/exam-types");
  return ensureArray<ExamType>(data);
}

export async function getSubTopicData(): Promise<Record<string, SubTopic[]>> {
  const data = await fetchWithAuth("/api/sub-topics");
  if (!data) return {};
  
  // Ensure each sub-topic list is an array
  const result: Record<string, SubTopic[]> = {};
  Object.keys(data).forEach(key => {
    result[key] = ensureArray<SubTopic>(data[key]);
  });
  
  return result;
}
