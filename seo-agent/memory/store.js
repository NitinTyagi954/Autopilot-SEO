// memory/store.js
//
// Minimal persistent memory: a JSON file recording every keyword/topic
// the agent has generated SEO output for. This lets the agent notice
// keyword cannibalization ("we already have a post targeting this exact
// keyword") across runs, not just within a single run.

const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(__dirname, "memory-store.json");

function loadMemory() {
  if (!fs.existsSync(MEMORY_PATH)) {
    return { generatedPosts: [] };
  }
  const raw = fs.readFileSync(MEMORY_PATH, "utf-8");
  return JSON.parse(raw);
}

function saveMemory(memory) {
  fs.writeFileSync(MEMORY_PATH, JSON.stringify(memory, null, 2), "utf-8");
}

/**
 * Records that the agent generated SEO output for a post targeting
 * `keyword`, so future runs can check against it.
 */
function recordGeneratedPost({ title, slug, keyword }) {
  const memory = loadMemory();
  memory.generatedPosts.push({
    title,
    slug,
    keyword: keyword.toLowerCase(),
    generatedAt: new Date().toISOString(),
  });
  saveMemory(memory);
}

/**
 * Returns true (and the conflicting entry) if a given keyword has
 * already been targeted by a previously generated post.
 */
function checkKeywordCannibalization(keyword) {
  const memory = loadMemory();
  const conflict = memory.generatedPosts.find(
    (p) => p.keyword === keyword.toLowerCase()
  );
  return conflict ? { conflict: true, existing: conflict } : { conflict: false };
}

module.exports = { loadMemory, recordGeneratedPost, checkKeywordCannibalization };
