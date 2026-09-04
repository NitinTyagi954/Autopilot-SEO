// baseline/baseline.js
//
// The "simple baseline" this project compares against: one direct prompt
// to the LLM asking for SEO tags. No site context, no verification loop,
// no memory. Whatever comes back on the first try is the final output.
//
// Usage: node baseline/baseline.js eval/sample-posts/post-01.md

require("dotenv").config();
const fs = require("fs");
const { generateJson } = require("../lib/geminiClient");

async function runBaseline(postPath) {
  const postContent = fs.readFileSync(postPath, "utf-8");

  const prompt = `Here is a blog post. Generate SEO tags for it.

Return ONLY valid JSON with this exact shape, no other text:
{
  "titleTag": "...",
  "metaDescription": "...",
  "slug": "...",
  "primaryKeyword": "...",
  "altText": ["..."],
  "internalLinks": [{ "url": "...", "anchorText": "..." }],
  "schemaMarkup": "..."
}

Blog post:
---
${postContent}
---`;

  return await generateJson(prompt, { model: "gemini-2.5-flash" });
}

if (require.main === module) {
  const postPath = process.argv[2];
  if (!postPath) {
    console.error("Usage: node baseline/baseline.js <path-to-post>");
    process.exit(1);
  }
  runBaseline(postPath)
    .then((seo) => console.log(JSON.stringify(seo, null, 2)))
    .catch((err) => {
      console.error("Baseline failed:", err.message);
      process.exit(1);
    });
}

module.exports = { runBaseline };
