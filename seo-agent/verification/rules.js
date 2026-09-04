// verification/rules.js
//
// Deterministic, rule-based checks applied to the agent's generated SEO
// output. This is what turns "one LLM call" into a verification loop:
// each check either passes or fails, with a reason, and the agent uses
// the failures to decide what to regenerate.

const TITLE_MIN = 40;
const TITLE_MAX = 60;
const META_MIN = 120;
const META_MAX = 160;

function checkTitleLength(seo) {
  const len = (seo.titleTag || "").length;
  const pass = len >= TITLE_MIN && len <= TITLE_MAX;
  return {
    check: "titleLength",
    pass,
    detail: `title tag is ${len} chars (target ${TITLE_MIN}-${TITLE_MAX})`,
  };
}

function checkMetaDescriptionLength(seo) {
  const len = (seo.metaDescription || "").length;
  const pass = len >= META_MIN && len <= META_MAX;
  return {
    check: "metaDescriptionLength",
    pass,
    detail: `meta description is ${len} chars (target ${META_MIN}-${META_MAX})`,
  };
}

function checkKeywordInTitle(seo) {
  const kw = (seo.primaryKeyword || "").toLowerCase();
  const title = (seo.titleTag || "").toLowerCase();
  const pass = kw.length > 0 && title.includes(kw);
  return {
    check: "keywordInTitle",
    pass,
    detail: pass
      ? "primary keyword found in title tag"
      : "primary keyword missing from title tag",
  };
}

function checkKeywordInMeta(seo) {
  const kw = (seo.primaryKeyword || "").toLowerCase();
  const meta = (seo.metaDescription || "").toLowerCase();
  const pass = kw.length > 0 && meta.includes(kw);
  return {
    check: "keywordInMeta",
    pass,
    detail: pass
      ? "primary keyword found in meta description"
      : "primary keyword missing from meta description",
  };
}

function checkSlugFormat(seo) {
  const slug = seo.slug || "";
  const pass = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 75;
  return {
    check: "slugFormat",
    pass,
    detail: pass ? "slug is well-formed" : `slug "${slug}" is not clean lowercase-hyphenated`,
  };
}

function checkAltTextPresent(seo, post) {
  const imageCount = (post.images || []).length;
  const altCount = (seo.altText || []).length;
  const pass = imageCount === 0 || altCount >= imageCount;
  return {
    check: "altTextPresent",
    pass,
    detail: `${altCount}/${imageCount} images have alt text`,
  };
}

function checkInternalLinks(seo) {
  const pass = Array.isArray(seo.internalLinks) && seo.internalLinks.length >= 1;
  return {
    check: "internalLinksPresent",
    pass,
    detail: pass
      ? `${seo.internalLinks.length} internal link(s) suggested`
      : "no internal links suggested",
  };
}

function checkSchemaPresent(seo) {
  const pass = !!seo.schemaMarkup && seo.schemaMarkup.includes("@type");
  return {
    check: "schemaMarkupPresent",
    pass,
    detail: pass ? "schema markup present" : "schema markup missing or invalid",
  };
}

/**
 * Runs every rule against a generated SEO object and the original post.
 * Returns { allPassed, results, failedChecks }.
 */
function runVerification(seo, post) {
  const results = [
    checkTitleLength(seo),
    checkMetaDescriptionLength(seo),
    checkKeywordInTitle(seo),
    checkKeywordInMeta(seo),
    checkSlugFormat(seo),
    checkAltTextPresent(seo, post),
    checkInternalLinks(seo),
    checkSchemaPresent(seo),
  ];
  const failedChecks = results.filter((r) => !r.pass);
  return {
    allPassed: failedChecks.length === 0,
    results,
    failedChecks,
  };
}

module.exports = { runVerification, TITLE_MIN, TITLE_MAX, META_MIN, META_MAX };
