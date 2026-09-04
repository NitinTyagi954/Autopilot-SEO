# Problem Statement & Solution

## Problem Statement

### Who has this problem?
Any company or individual that runs a blog as part of its digital marketing strategy — founders, marketing teams, and content writers who are responsible for regularly publishing blog content but do not have a dedicated in-house SEO specialist. This includes teams running a CMS-driven blog (such as a Next.js-based company blog) where new posts need to consistently rank well in search engines.

### What bottleneck makes it worth solving?
Writing good blog content is only half the job. To actually perform well in search rankings and drive organic traffic, every post needs a complete, correctly-optimized set of SEO elements attached to it:

- An SEO-optimized title tag (within the right character length, containing the target keyword)
- A compelling meta description (within the right character range)
- A clean, keyword-relevant URL slug
- Proper heading structure (H1/H2/H3 use)
- Natural, non-stuffed keyword usage throughout the content
- Descriptive alt text for images
- Relevant internal links to other existing pages/posts on the site
- Structured data / schema markup for articles

Doing this manually, for every single post, is tedious and time-consuming, and it is easy to be inconsistent — a writer may forget alt text on one post, write a meta description that's too long on another, or miss an obvious internal linking opportunity because they don't have the full picture of what else exists on the site. Over time, this inconsistency directly hurts organic search performance, even when the actual writing quality is high.

### Does the agent solve it well?
An agent can take a completed, manually-written blog post and handle the entire SEO layer around it — automatically, consistently, and informed by the actual content that already exists on the site (not just the single post in isolation). Rather than a human treating SEO as an afterthought or a generic checklist, the agent generates every required SEO element, checks its own output against SEO rules, and only returns a result once it passes those checks.

### Can another person reproduce the result?
Yes. The evaluation only requires a small set of sample blog posts (public or synthetic) as input, along with a fixed, shareable SEO scoring rubric. Anyone can rerun the same posts through the baseline and the agent, apply the same rubric, and reproduce the comparison and scores.

---

## Solution

### Overview
The solution is an SEO agent that takes a manually-written, finished blog post as input and outputs a complete, publish-ready SEO package for it: title tag, meta description, slug, keyword analysis, alt text suggestions, internal linking suggestions, and schema markup. The agent never publishes anything itself — publishing remains a fully manual, human-controlled action. The agent's only job is to remove the manual SEO work that currently happens after a post is written.

### What the agent does, step by step
1. **Input**: A human supplies a finished blog post (title + body content), written the normal way, with no SEO work done on it yet.
2. **Site context (tool use)**: The agent fetches real content from the existing site — via the CMS/API — including other published blog posts and key pages, rather than working from the new post in isolation. This context is what makes internal linking suggestions and keyword-overlap checks meaningful rather than guessed.
3. **Generation**: Using the post content and the site context, the agent generates:
   - Title tag
   - Meta description
   - URL slug
   - Target keyword(s) and where they appear/are missing in the content
   - Alt text suggestions for any images in the post
   - A short list of internal links to existing pages/posts, with the anchor text and reasoning
   - Article schema markup (JSON-LD)
4. **Verification loop**: A second pass checks the generated output against a fixed set of SEO rules — for example, title tag length within range, meta description length within range, target keyword present in the title/meta description/first paragraph, no missing alt text, no duplicate keyword targeting an existing post. If any check fails, the agent regenerates the failing element rather than returning it as-is. Only output that passes every check is returned.
5. **Memory**: The agent keeps a record of keywords and topics used in previously generated posts, so it can flag or avoid keyword cannibalization (two posts unintentionally competing for the same target keyword) when generating SEO output for a new post.
6. **Output**: A complete SEO package attached to the original post content, ready for a human to review and publish through their normal CMS workflow. The agent does not publish or modify the live site.

### What makes this "agentic" rather than a single prompt
- **Tool use** — the agent actively pulls real, current content from the site rather than relying only on the single post it was given, which is what makes its internal linking and keyword-overlap suggestions grounded rather than guessed.
- **Verification loop** — the agent checks and, if necessary, regenerates its own output against explicit SEO rules before returning a final result, rather than returning whatever the first generation produces.
- **Memory** — the agent tracks keyword/topic history across posts over time, so its decisions on a new post are informed by everything generated before it, not just the current input.

### Baseline for comparison
A single direct prompt to an LLM: "Here is a blog post. Generate SEO tags for it." This baseline receives only the raw post text — no site context, no verification, no memory — and returns whatever the first response produces, with no self-checking.

### How it will be evaluated
Both the baseline and the agent will be run on the same set of sample blog posts (10 or more, including at least one post that has an obvious internal linking opportunity and one where the natural keyword is easy to miss). Each output will be scored against a fixed SEO checklist — for example: title tag within length range, meta description within length range, keyword present and not stuffed, alt text present for all images, at least one relevant internal link suggested, valid schema markup present. The comparison will show, case by case, how much the agent's grounding, verification, and memory improve the result over the baseline's single-shot output.

### Human stays in control
At every stage, the agent's output is a draft SEO package for a human to review — not a live action. Publishing the post, and accepting or rejecting any individual SEO suggestion, remains entirely in the hands of the person managing the blog.
