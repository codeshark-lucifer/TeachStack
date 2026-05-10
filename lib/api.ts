import { ExamCategory, Question, ExamType, SubTopic } from "./data";
import { db } from "./firebase";
import { ref, get, child } from "firebase/database";

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

export async function getCategories(): Promise<ExamCategory[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "categories"));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categories = Object.values(data);
      return categories.map(transformCategory);
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<ExamCategory | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `categories/${id}`));
    
    if (snapshot.exists()) {
      return transformCategory(snapshot.val());
    }
    return null;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

export async function getQuestionsByCategoryId(id: string): Promise<Question[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `categories/${id}/questions`));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : Object.values(data);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching questions for ${id}:`, error);
    return [];
  }
}

export async function getExamTypes(): Promise<ExamType[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "examTypes"));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : Object.values(data);
    }
    return [];
  } catch (error) {
    console.error("Error fetching exam types:", error);
    return [];
  }
}

export async function getSubTopicData(): Promise<Record<string, SubTopic[]>> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "subTopicData"));
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.error("Error fetching sub topic data:", error);
    return {};
  }
}
