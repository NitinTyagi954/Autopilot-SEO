# SEO Agent — Agentic Workflows Hackathon

Takes a manually-written, finished blog post and generates a complete,
verified SEO package for it (title tag, meta description, slug, keyword
analysis, alt text, internal link suggestions, schema markup). Publishing
stays 100% manual — this agent only handles the SEO layer.

See `/PROBLEM_AND_SOLUTION.md` for the full problem statement and solution.

## Project structure

```
seo-agent/
├── data/
│   └── mock-site.json        # mock CMS content: existing pages/posts (stand-in for real CMS API)
├── memory/
│   ├── store.js              # simple JSON-file memory: keywords/topics used so far
│   └── memory-store.json     # the persisted memory file (created on first run)
├── lib/
│   └── geminiClient.js       # shared Gemini client wrapper (@google/generative-ai, gemini-2.5-flash)
├── tools/
│   └── siteContent.js        # "tool" the agent calls to fetch site context (reads data/mock-site.json)
├── verification/
│   └── rules.js              # rule-based checks the generated SEO output must pass
├── baseline/
│   └── baseline.js           # single-prompt baseline (no tools, no verification, no memory)
├── agent.js                  # the actual agent: generate -> verify -> regenerate loop
├── eval/
│   ├── sample-posts/         # ~10 sample blog posts used for baseline vs. agent comparison
│   ├── checklist.js          # scoring checklist applied to any SEO output
│   └── run-eval.js           # runs baseline + agent on all sample posts, prints scores
├── CHANGELOG.md              # improvement changelog (fill in as you iterate)
├── .env.example
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
# add your GEMINI_API_KEY to .env
```

## Run things

```bash
# run the baseline on one sample post
node baseline/baseline.js eval/sample-posts/post-01.md

# run the agent on one sample post
node agent.js eval/sample-posts/post-01.md

# run baseline vs. agent across all sample posts and print scores
node eval/run-eval.js
```

## Next steps (fill in as you build)
- Replace `tools/siteContent.js` mock reads with a real CMS API call
- Add more sample posts to `eval/sample-posts/`
- Tune `verification/rules.js` thresholds to match your actual SEO standards
- Log each meaningful change to `CHANGELOG.md` with before/after evidence
