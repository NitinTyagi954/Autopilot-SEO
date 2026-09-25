# Autopilot SEO — Architecture Documentation

Autopilot SEO is designed as a **modular monolith** combining a high-performance Django REST Framework API with a Next.js (App Router) frontend, backed by PostgreSQL.

---

## High-Level Topology

```text
               +--------------------------------------+
               |          Next.js Frontend            |
               |  (App Router, TypeScript, Tailwind)  |
               +-------------------+------------------+
                                   |
                                   | HTTP / REST (/api/v1/)
                                   v
               +--------------------------------------+
               |       Django REST Framework          |
               |         (Modular Monolith)           |
               +-------------------+------------------+
                                   |
                                   | Django ORM
                                   v
               +--------------------------------------+
               |             PostgreSQL               |
               +--------------------------------------+
```

---

## Domain Separation

To prevent tight coupling and ensure future scalability without premature microservices, the backend is cleanly partitioned into domain-specific Django apps:

1. **`apps.sites`**: Multi-tenant site management.
   - `Site`: The root entity for all content. Has unique slugs, domains, and UUID primary keys.

2. **`apps.posts`**: Editorial content creation.
   - `Post`: Scoped to `Site`, status workflow (`draft`, `published`, `archived`), TipTap structured JSON storage (`content`) and fast HTML SSR render (`content_html`). Unique slug per site.

3. **`apps.taxonomy`**: Content categorization.
   - `Category`: Vertical categories scoped per site.
   - `Tag`: Many-to-many topic tags scoped per site.

4. **`apps.media`**: Digital asset management.
   - `Media`: Storage-abstract interface (Local, Amazon S3, Cloudflare R2). Avoids storing binaries in PostgreSQL.

5. **`apps.seo`**: Decoupled SEO intelligence foundation.
   - `PostSEO`: One-to-one relationship with `Post`. Captures focus keywords, canonical tags, meta titles, descriptions, and Open Graph social cards.

---

## REST API Specification (`/api/v1/`)

| Method | Endpoint | Description |
|---|---|---|
| `GET / POST` | `/api/v1/sites/` | List and create websites |
| `GET / PATCH / DELETE` | `/api/v1/sites/{id}/` | Site details and updates |
| `GET / POST` | `/api/v1/posts/` | List and create blog posts |
| `GET / PATCH / DELETE` | `/api/v1/posts/{id}/` | Retrieve/update post details |
| `GET` | `/api/v1/posts/public/{slug}/` | Public published post by slug (404 for drafts) |
| `GET` | `/api/v1/posts/public/` | Public archive of published posts |
| `GET / POST` | `/api/v1/categories/` | List and create categories |
| `GET / POST` | `/api/v1/tags/` | List and create tags |
| `GET / POST` | `/api/v1/media/` | List and upload media assets |
| `GET / PUT / PATCH` | `/api/v1/posts/{id}/seo/` | Get or update 1:1 PostSEO configuration |

---

## Future Modular Roadmap

The architecture is deliberately prepared to incorporate the following modules without breaking changes:

```text
                 Autopilot SEO
                       │
          ┌────────────┼────────────┐
          │            │            │
         CMS       SEO Engine    AI Agent
          │            │            │
          └────────────┼────────────┘
                       │
                Site Knowledge
                       │
          ┌────────────┴────────────┐
          │                         │
     Search Data              Analytics
```

- **SEO Engine**: Rule evaluation, cannibalization analysis, automated internal link suggestions, and JSON-LD schema generation.
- **AI Agent**: Background LLM verification loop with prompt memory and tool grounding.
- **Site Knowledge**: Site-wide embeddings and sitemap crawler.
- **Analytics Connectors**: Google Search Console and web traffic analytics.
