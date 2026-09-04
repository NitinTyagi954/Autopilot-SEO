// tools/siteContent.js
//
// This is the "tool" the agent calls to ground itself in the real site,
// instead of guessing internal links / keyword overlap from the single
// post it was given. Right now it reads a local mock JSON file so the
// project runs with zero external dependencies during the hackathon.
//
// TODO (post-hackathon / real integration): replace readMockSite() with
// a real call to your CMS API, e.g. fetch(`${CMS_API_URL}/posts`).

const fs = require("fs");
const path = require("path");

const MOCK_SITE_PATH = path.join(__dirname, "..", "data", "mock-site.json");

function readMockSite() {
  const raw = fs.readFileSync(MOCK_SITE_PATH, "utf-8");
  return JSON.parse(raw);
}

/**
 * Returns the full site context: existing pages + existing blog posts,
 * with their titles, URLs, and primary keywords. This is what the agent
 * uses to suggest internal links and check for keyword overlap.
 */
function getSiteContext() {
  const site = readMockSite();
  return {
    siteName: site.siteName,
    pages: site.pages,
    posts: site.posts,
  };
}

/**
 * Returns just the list of primary keywords already targeted by
 * existing posts, used for keyword-cannibalization checks.
 */
function getExistingKeywords() {
  const site = readMockSite();
  return site.posts.map((p) => p.primaryKeyword.toLowerCase());
}

module.exports = { getSiteContext, getExistingKeywords };
