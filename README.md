# Autopilot-SEO

**An open-source, self-hosted blog CMS with a built-in, AI-grounded SEO agent.**

> 🚧 Status: early development. Core CMS is being built first — see [Roadmap](#roadmap) below.

## What is this?

Most teams end up choosing between two bad options for their blog:
a bare-bones CMS with no SEO help, or an expensive SaaS platform that
handles SEO but locks you in. Autopilot-SEO combines both in one
open-source, self-hosted tool:

- A real blog CMS — posts, categories, tags, images, draft/publish workflow
- A built-in SEO layer, including an AI agent that generates a complete,
  verified SEO package for every post (title tag, meta description, slug,
  keyword analysis, alt text, internal link suggestions, schema markup)
- The agent is **grounded in your site's own real content** (not generic
  guesses) and runs its output through a rule-based verification loop
  before returning it
- You stay in control — the agent never publishes anything automatically;
  every suggestion is reviewed and approved by a human

## Why

Doing SEO correctly for every blog post — by hand, every time — is
tedious and easy to get inconsistent. Existing tools either solve content
management or SEO, rarely both, and almost never as something you can
self-host and fully own.

## Tech stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Database & Storage:** Supabase (Postgres + Storage)
- **AI:** Gemini API (free tier)

## Roadmap

- [ ] **Phase 0 — Core CMS**: posts, categories, tags, image uploads,
      draft/publish workflow
- [ ] **Phase 1 — SEO fields UI**: title tag, meta description, keywords,
      alt text, Open Graph fields, schema markup, and a rule-based SEO
      checklist — all manually editable, no AI required yet
- [ ] **Phase 2 — AI SEO agent**: one-click SEO generation grounded in
      real site data, with a verification loop and keyword-cannibalization
      memory
- [ ] **Phase 3 — Idea-to-draft**: agent drafts a full post from just a
      topic
- [ ] **Phase 4 — Competitor analysis**: ground the agent in competitor
      content, not just your own
- [ ] **Phase 5 — Auth / multi-user**: so others can self-host this for
      their own teams

## Getting started

Setup instructions will be added here once Phase 0 is running.

## Contributing

This project is early and evolving — issues and pull requests are welcome
once the core CMS lands. Contribution guidelines will be added soon.

## License

MIT — see [LICENSE](./LICENSE).
