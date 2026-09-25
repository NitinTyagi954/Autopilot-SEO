# Autopilot SEO — Initial Foundation Phase

Autopilot SEO is an open-source, scalable SEO and content management platform built as a clean **modular monolith**.

---

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, TipTap Rich Text Editor, Lucide Icons.
- **Backend**: Python 3.11+, Django 5+, Django REST Framework (DRF), `django-cors-headers`.
- **Database**: PostgreSQL 16 (with SQLite dev fallback).
- **Containerization**: Docker & Docker Compose.

---

## Repository Structure

```text
autopilot-seo/
├── client/                      # Next.js frontend application
│   ├── app/
│   │   ├── (admin)/             # Admin Dashboard, Sites, Posts, SEO, Media, etc.
│   │   └── blog/                # Public blog archive and /blog/[slug] reader
│   ├── components/
│   │   ├── editor/              # TipTap rich text editor
│   │   ├── seo/                 # SEO configuration & SERP preview component
│   │   └── ui/                  # Reusable UI primitives
│   ├── context/                 # Multi-site Context provider
│   ├── lib/                     # Typed REST API client
│   └── types/                   # TypeScript interfaces
│
├── server/                      # Django REST API modular monolith
│   ├── config/                  # Django settings & routing
│   ├── apps/
│   │   ├── sites/               # Site domain model
│   │   ├── posts/               # Post domain model & public endpoints
│   │   ├── taxonomy/            # Category & Tag domain models
│   │   ├── media/               # Media asset domain model
│   │   └── seo/                 # Dedicated 1:1 PostSEO domain model
│   └── manage.py
│
├── docs/
│   └── architecture.md          # Architecture specs & future roadmap
├── docker-compose.yml           # Multi-container orchestration (client, server, postgres)
├── .env.example                 # Environment variable templates
└── README.md
```

---

## Quick Start with Docker Compose

To launch the full stack (PostgreSQL, Django API, Next.js frontend):

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and launch containers
docker compose up --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Django REST API**: [http://localhost:8000/api/v1/](http://localhost:8000/api/v1/)
- **Admin Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Public Blog**: [http://localhost:3000/blog](http://localhost:3000/blog)

---

## Local Development (Without Docker)

### Backend (Django)

```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py test apps
python manage.py runserver 0.0.0.0:8000
```

### Frontend (Next.js)

```bash
cd client
npm install
npm run dev
```

---

## Completed Vertical Slice Flow

1. **Create Website**: Navigate to `/sites` to create and select a site entity.
2. **Write Rich Post**: Open `/posts/new` to compose structured content with TipTap.
3. **Configure SEO**: Set focus keyword, SERP title, meta description, and social tags.
4. **Draft vs. Publish**:
   - Save as `Draft`: Viewable only in admin, returns `404` publicly on `/blog/[slug]`.
   - Click `Publish`: Post goes live on `/blog/[slug]` with SSR and meta tag tags.
