const API_SECRET = "93be302a20343ee34f4049757949185554b479d6ff847766183412724981177d";
const BASE_URL = "https://teach-stack-khmer.vercel.app";

async function testApi(endpoint) {
  console.log(`\n--- Testing ${endpoint} ---`);
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "x-api-token": API_SECRET }
    });
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log("Data structure:", Array.isArray(data) ? `Array (${data.length} items)` : typeof data);
    if (endpoint.includes("category/education")) {
        console.log("Education Category ID:", data.id);
        console.log("Questions field present:", !!data.questions);
        console.log("Questions count:", data.questions ? Object.keys(data.questions).length : 0);
    }
    if (endpoint.includes("questions/education")) {
        console.log("Questions returned:", JSON.stringify(data).substring(0, 200) + "...");
    }
    return data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
  }
}

async function runTests() {
  await testApi("/api/categories");
  await testApi("/api/category/education");
  await testApi("/api/questions/education");
  await testApi("/api/exam-types");
  await testApi("/api/sub-topics");
}

runTests();
