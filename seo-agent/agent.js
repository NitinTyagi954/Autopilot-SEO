// agent.js
//
// The actual agent. Unlike the baseline, this:
//   1. Calls a tool to fetch real site context before generating anything
//   2. Runs a verification loop: generated output is checked against
//      explicit rules, and failing elements are regenerated
//   3. Uses memory to flag keyword cannibalization against past runs
//
// Usage: node agent.js eval/sample-posts/post-01.md

require("dotenv").config();
const fs = require("fs");
const { generateJson } = require("./lib/geminiClient");
const { getSiteContext } = require("./tools/siteContent");
const { runVerification } = require("./verification/rules");
const {
  recordGeneratedPost,
  checkKeywordCannibalization,
} = require("./memory/store");

const MAX_ATTEMPTS = 3;

function buildPrompt(postContent, siteContext, feedback) {
  const existingPosts = siteContext.posts
    .map((p) => `- "${p.title}" (${p.url}), primary keyword: ${p.primaryKeyword}`)
    .join("\n");
  const existingPages = siteContext.pages
    .map((p) => `- "${p.title}" (${p.url})`)
    .join("\n");

  const feedbackBlock = feedback
    ? `\nYour previous attempt failed these checks — fix them:\n${feedback
        .map((f) => `- ${f.check}: ${f.detail}`)
        .join("\n")}\n`
    : "";

  return `You are an SEO assistant for the site "${siteContext.siteName}".
Generate a complete SEO package for the blog post below.

Existing site pages (for context — do not duplicate their keywords):
${existingPages}

Existing blog posts (use these for internal linking suggestions where relevant, and avoid targeting the same primary keyword as any of them):
${existingPosts}
${feedbackBlock}
Return ONLY valid JSON with this exact shape, no other text:
{
  "titleTag": "... (40-60 characters)",
  "metaDescription": "... (120-160 characters)",
  "slug": "lowercase-hyphenated-slug",
  "primaryKeyword": "...",
  "altText": ["short descriptive alt text for each image mentioned in the post"],
  "internalLinks": [{ "url": "...", "anchorText": "..." }],
  "schemaMarkup": "a valid JSON-LD string for a BlogPosting, including @type"
}

Blog post:
---
${postContent}
---`;
}

async function generateSeo(postContent, siteContext, feedback) {
  const prompt = buildPrompt(postContent, siteContext, feedback);
  return await generateJson(prompt, { model: "gemini-2.5-flash" });
}

/**
 * Very rough image detector for the mock post format: counts markdown
 * image syntax ![alt](url) so verification knows how many alt texts
 * are expected. Swap for your real CMS's content model later.
 */
function detectImages(postContent) {
  const matches = postContent.match(/!\[.*?\]\(.*?\)/g) || [];
  return matches.map((m, i) => ({ id: i }));
}

async function runAgent(postPath) {
  const postContent = fs.readFileSync(postPath, "utf-8");
  const post = { content: postContent, images: detectImages(postContent) };

  // Step 1: tool use — ground the agent in real site context
  const siteContext = getSiteContext();

  let seo;
  let verification;
  let feedback = null;

  // Step 2: generate -> verify -> regenerate loop
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    seo = await generateSeo(postContent, siteContext, feedback);
    verification = runVerification(seo, post);

    if (verification.allPassed) break;
    feedback = verification.failedChecks;
  }

  // Step 3: memory check — keyword cannibalization against past runs
  const cannibalization = checkKeywordCannibalization(seo.primaryKeyword || "");

  if (!cannibalization.conflict) {
    recordGeneratedPost({
      title: seo.titleTag,
      slug: seo.slug,
      keyword: seo.primaryKeyword,
    });
  }

  return {
    seo,
    verification,
    cannibalization,
  };
}

if (require.main === module) {
  const postPath = process.argv[2];
  if (!postPath) {
    console.error("Usage: node agent.js <path-to-post>");
    process.exit(1);
  }
  runAgent(postPath)
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((err) => {
      console.error("Agent failed:", err.message);
      process.exit(1);
    });
}

module.exports = { runAgent };
