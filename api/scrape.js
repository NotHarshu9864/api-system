import { chromium } from "playwright-core";

export default async function handler(req, res) {
  try {
    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://e-leak.vercel.app/nexttoppers", {
      waitUntil: "networkidle"
    });

    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const batches = [];

      document.querySelectorAll("section").forEach((batchEl) => {
        const batchName =
          batchEl.querySelector("h1, h2, h3")?.innerText?.trim() ||
          "Unknown Batch";

        const subjects = [];

        batchEl.querySelectorAll("div").forEach((subjectEl) => {
          const subjectName =
            subjectEl.querySelector("h2, h3, h4")?.innerText?.trim();

          if (!subjectName) return;

          let lectureCount = 1;
          const lectures = [];

          subjectEl.querySelectorAll("a").forEach((a) => {
            const url = a.href;

            if (!url) return;

            if (url.includes("youtu") || url.includes("video")) {
              lectures.push({
                title: `Lecture ${lectureCount++}`,
                play: url,
                notes: ""
              });
            }

            if (url.includes("pdf") || url.includes("notes")) {
              const last = lectures[lectures.length - 1];
              if (last) last.notes = url;
            }
          });

          if (lectures.length > 0) {
            subjects.push({
              title: subjectName,
              lectures
            });
          }
        });

        if (subjects.length > 0) {
          batches.push({
            batch: batchName,
            subjects
          });
        }
      });

      return batches;
    });

    await browser.close();

    res.status(200).json({
      success: true,
      generatedAt: new Date().toISOString(),
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}