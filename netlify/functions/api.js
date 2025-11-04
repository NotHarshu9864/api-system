// netlify/functions/api.js

import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    const { batchid, subjectid, chapterid } = event.queryStringParameters;

    // Read data.json file from /data folder
    const filePath = path.join(process.cwd(), "data", "data.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    let result = data.batches;

    if (batchid) {
      result = result.find(b => b.id === batchid);
      if (!result) return { statusCode: 404, body: "Batch not found" };
    }

    if (subjectid && result.subjects) {
      result = result.subjects.find(s => s.id === subjectid);
      if (!result) return { statusCode: 404, body: "Subject not found" };
    }

    if (chapterid && result.chapters) {
      result = result.chapters.find(c => c.id === chapterid);
      if (!result) return { statusCode: 404, body: "Chapter not found" };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return { statusCode: 500, body: "Error: " + err.message };
  }
  }
