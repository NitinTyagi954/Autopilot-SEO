// eval/checklist.js
//
// Scores a generated SEO object out of 8 points using the same rules
// defined in verification/rules.js, so baseline and agent output are
// judged identically and fairly.

const { runVerification } = require("../verification/rules");

function scoreSeoOutput(seo, post) {
  const verification = runVerification(seo, post);
  const passedCount = verification.results.filter((r) => r.pass).length;
  return {
    score: passedCount,
    outOf: verification.results.length,
    results: verification.results,
  };
}

module.exports = { scoreSeoOutput };
