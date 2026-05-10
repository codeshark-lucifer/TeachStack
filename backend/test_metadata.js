const headers = {
  "x-api-token": "93be302a20343ee34f4049757949185554b479d6ff847766183412724981177d",
  "Accept": "application/json",
};

const fetchData = async (endpoint) => {
  const url = `https://teach-stack-khmer.vercel.app/api/${endpoint}`;
  try {
    const response = await fetch(url, { method: "GET", headers: headers });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log(`\n--- DATA FROM ${endpoint} ---`);
    console.log(data);
  } catch (err) {
    console.error(`Error for ${endpoint}: ${err.message}`);
  }
};

const run = async () => {
  await fetchData("exam-types");
  await fetchData("sub-topics");
};

run();