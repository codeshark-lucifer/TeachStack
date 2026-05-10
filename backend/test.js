const url = "https://teach-stack-khmer.vercel.app/api/category/education";
const headers = {
  "x-api-token": "93be302a20343ee34f4049757949185554b479d6ff847766183412724981177d",
  "Accept": "application/json",
};

// We wrap it in a named function or an IIFE so it actually executes
const fetchData = async () => {
  const controller = new AbortController();
  // Set the timeout for 30 seconds (30000 ms)
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("The request timed out.");
    } else {
      console.error(`An unexpected error occurred: ${err.message}`);
    }
  } finally {
    // Always clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
};

fetchData();