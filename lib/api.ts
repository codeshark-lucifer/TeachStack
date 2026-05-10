import { ExamCategory, Question, ExamType, SubTopic } from "./data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001";
const API_SECRET = process.env.API_SECRET || "your_api_secret_token";

// Local image mapping for fallback or cleaning backend paths
const localImageMap: Record<string, string> = {
  education: "/images/education.png",
  health: "/images/health.png",
  interior: "/images/police.svg",
  civil: "/images/MSC.png",
  agriculture: "/images/MAFF.png",
};

function transformCategory(category: any): ExamCategory {
  let image = category.image || "";
  
  // Use local mapping if available for the ID
  if (localImageMap[category.id]) {
    image = localImageMap[category.id];
  } else if (image && !image.startsWith("/") && !image.startsWith("http")) {
    image = "/" + image.replace(/^assets\//, "");
  }

  // Handle Firebase returning arrays as objects
  let questions = category.questions || [];
  if (questions && !Array.isArray(questions)) {
    questions = Object.values(questions);
  }

  return {
    ...category,
    image,
    color: category.color || "#3467d6",
    questions: questions,
  };
}

async function fetchWithAuth(endpoint: string) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      "x-api-token": API_SECRET,
    },
    // Revalidate every hour for static-ish data
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
  }

  return response.json();
}

export async function getCategories(): Promise<ExamCategory[]> {
  try {
    const data = await fetchWithAuth("/api/categories");
    if (!data) return [];
    
    const categories = Array.isArray(data) ? data : Object.values(data);
    return categories.map(transformCategory);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<ExamCategory | null> {
  try {
    const data = await fetchWithAuth(`/api/category/${id}`);
    return data ? transformCategory(data) : null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

export async function getQuestionsByCategoryId(id: string): Promise<Question[]> {
  try {
    const data = await fetchWithAuth(`/api/questions/${id}`);
    if (!data) return [];
    return Array.isArray(data) ? data : Object.values(data);
  } catch (error) {
    console.error(`Error fetching questions for ${id}:`, error);
    return [];
  }
}

export async function getExamTypes(): Promise<ExamType[]> {
  try {
    const data = await fetchWithAuth("/api/exam-types");
    if (!data) return [];
    return Array.isArray(data) ? data : Object.values(data);
  } catch (error) {
    console.error("Error fetching exam types:", error);
    return [];
  }
}

export async function getSubTopicData(): Promise<Record<string, SubTopic[]>> {
  try {
    const data = await fetchWithAuth("/api/sub-topics");
    return data || {};
  } catch (error) {
    console.error("Error fetching sub topic data:", error);
    return {};
  }
}
