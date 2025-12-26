import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://e-leak.vercel.app/nexttoppers", {
      waitUntil: "networkidle2"
    });

    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const batches = [];

      document.querySelectorAll("section").forEach(batchEl => {
        const batchName =
          batchEl.querySelector("h1,h2,h3")?.innerText?.trim() ||
          "Unknown Batch";

        const subjects = [];

        batchEl.querySelectorAll("div").forEach(subjectEl => {
          const subjectName =
            subjectEl.querySelector("h2,h3,h4")?.innerText?.trim();

          if (!subjectName) return;

          let count = 1;
          const lectures = [];

          subjectEl.querySelectorAll("a").forEach(a => {
            const url = a.href;
            if (!url) return;

            if (url.includes("youtu") || url.includes("video")) {
              lectures.push({
                title: `Lecture ${count++}`,
                play: url,
                notes: ""
              });
            }

            if (url.includes("pdf") || url.includes("notes")) {
              const last = lectures[lectures.length - 1];
              if (last) last.notes = url;
            }
          });

          if (lectures.length) {
            subjects.push({
              title: subjectName,
              lectures
            });
          }
        });

        if (subjects.length) {
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

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}