// eval/run-eval.js
//
// Runs the baseline and the agent on every sample post in
// eval/sample-posts/, scores each output with the same checklist,
// and prints a side-by-side comparison table.
//
// Usage: node eval/run-eval.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { runBaseline } = require("../baseline/baseline");
const { runAgent } = require("../agent");
const { scoreSeoOutput } = require("./checklist");

const SAMPLE_DIR = path.join(__dirname, "sample-posts");

function detectImages(postContent) {
  const matches = postContent.match(/!\[.*?\]\(.*?\)/g) || [];
  return matches.map((m, i) => ({ id: i }));
}

async function main() {
  const files = fs
    .readdirSync(SAMPLE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error(`No sample posts found in ${SAMPLE_DIR}`);
    process.exit(1);
  }

  const rows = [];

  for (const file of files) {
    const postPath = path.join(SAMPLE_DIR, file);
    const postContent = fs.readFileSync(postPath, "utf-8");
    const post = { content: postContent, images: detectImages(postContent) };

    process.stdout.write(`Running baseline + agent on ${file} ... `);

    let baselineScore = "ERROR";
    let agentScore = "ERROR";
    let agentAttempts = "-";

    try {
      const baselineSeo = await runBaseline(postPath);
      baselineScore = scoreSeoOutput(baselineSeo, post).score;
    } catch (e) {
      baselineScore = `ERROR: ${e.message}`;
    }

    try {
      const agentResult = await runAgent(postPath);
      agentScore = scoreSeoOutput(agentResult.seo, post).score;
    } catch (e) {
      agentScore = `ERROR: ${e.message}`;
    }

    console.log("done");
    rows.push({ file, baselineScore, agentScore });
  }

  console.log("\n=== Baseline vs. Agent (score out of 8 checks) ===\n");
  console.log(
    rows
      .map(
        (r) =>
          `${r.file.padEnd(20)} baseline: ${String(r.baselineScore).padEnd(
            10
          )} agent: ${r.agentScore}`
      )
      .join("\n")
  );
}

main().catch((err) => {
  console.error("Eval run failed:", err);
  process.exit(1);
});
