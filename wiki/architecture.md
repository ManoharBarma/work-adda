# Architecture & Infrastructure

## 1. High-Level System Architecture

The application is structured as a **modern, monolithic web application** using Next.js App Router. It integrates server-side rendering (SSR) for public SEO-indexed worker profiles and directory listings, paired with client components for interactive search, filters, and forms.

```
                           +------------------------------------------+
                           |           End Users / Devices            |
                           |   (Mobile Browsers / Android PWA)        |
                           +--------------------+---------------------+
                                                |
                         HTTPS (Public / CDN)   |
                                                v
                           +------------------------------------------+
                           |             Next.js Application          |
                           |   - Server Components (SEO / SSR)        |
                           |   - Client Components (Filters / Forms)  |
                           |   - API Routes / Server Actions          |
                           +--------------------+---------------------+
                                                |
                        Prisma Client (ORM)     |
                                                v
               +--------------------------------+--------------------------------+
               |                                                                 |
               v (Local Development)                                             v (Production)
+-------------------------------+                               +-------------------------------+
|  Docker PostgreSQL 16         |                               |  Neon.tech Serverless Postgres|
|  (postgres:16-alpine in WSL)  |                               |  (Zero-cost, Auto-scaling)    |
+-------------------------------+                               +-------------------------------+
```

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) + TypeScript | Hybrid SSR/SSG for public worker profiles, Server Actions for mutations. |
| **Styling** | Tailwind CSS | Mobile-first utility design with high-contrast, accessible touch targets (min 48px). |
| **Database & ORM** | PostgreSQL + Prisma ORM | Relational data integrity, schema migrations, and type-safe queries. |
| **Media Storage** | Cloudinary (Free Tier) | Worker profile photos and work samples compressed to WebP. |
| **Local Containerization** | Docker Engine & Docker Compose | Local PostgreSQL container with persistent volume for offline development. |
| **Production Hosting** | Vercel (Hobby Tier) | Zero-cost serverless hosting with automated GitHub deployments. |

---

## 3. WSL Development & Execution Rules

As defined in the project specification, **all build, execution, and database commands must run within WSL (Ubuntu 24.04)**.

* **WSL User:** `manu` (has rootless Docker socket permissions via `docker` group).
* **Node Version:** `v20.20.2 LTS`.
* **npm Version:** `10.8.2`.
* **Command Invocation Rule:** All commands executed from the agent shell must use:
  ```powershell
  wsl -d Ubuntu -u manu -- bash -ic "<command>"
  ```
* **Port Forwarding:** WSL 2 automatically maps `localhost:3000` (Next.js) and `localhost:5432` (PostgreSQL) directly to the Windows host browser.

---

## 4. Local Containerization (`docker-compose.yml`)

Local database services run through Docker inside WSL:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: sircilla_db
    restart: always
    environment:
      POSTGRES_USER: sircilla_admin
      POSTGRES_PASSWORD: sircilla_secure_pass
      POSTGRES_DB: sircilla_workers
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Switching Between Local Docker & Production Neon DB
Toggling environments requires only a change in `.env`:
* **Local Development:** `DATABASE_URL="postgresql://sircilla_admin:sircilla_secure_pass@localhost:5432/sircilla_workers?schema=public"`
* **Production (Neon):** `DATABASE_URL="postgresql://<user>:<pass>@<neon-host>/<db>?sslmode=require"`

---

## 5. Production Zero-Cost Deployment Architecture

The entire platform runs within free-tier limits without ongoing server overhead:
1. **GitHub:** Version control repository with main branch protection.
2. **Vercel (Hobby Tier):** Auto-deploys from GitHub on push. Free SSL, global edge CDN.
3. **Neon.tech (Free Tier):** Serverless PostgreSQL with 0.5 GB storage and connection pooling.
4. **Cloudinary (Free Tier):** Generates responsive image thumbnails and auto-optimizes uploads.
