# Local Worker Directory — Component Wiki

Welcome to the **Local Worker Directory (Sircilla)** documentation wiki. This folder serves as the central technical and architectural knowledge base for all subsystems, components, and workflows in the project.

---

## 📚 Wiki Directory Structure

| Document | Description |
| :--- | :--- |
| [Master Product Specification](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/product-specification.md) | The foundational product & engineering specification, core principles, Sircilla enhancements, and acceptance criteria. |
| [Architecture & Infrastructure](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/architecture.md) | High-level system architecture, WSL runtime rules, Docker container setup, and zero-cost hosting deployment. |
| [Database & Data Models](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/database-schema.md) | Prisma schema, PostgreSQL relations, indexes, status states, and click tracking counters. |
| [Analytics & Intent Tracking](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/components/analytics-tracker.md) | Zero-login engagement measurement, beacon-based call/WhatsApp tracking, anti-spam debouncing, and worker metrics. |
| [Customer Directory & Search](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/components/customer-directory.md) | Public search, category browsing, SEO worker profile pages, 1-tap call (`tel:`) and WhatsApp (`wa.me`) integration. |
| [Worker Portal & Onboarding](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/components/worker-portal.md) | Mobile OTP authentication, multi-step profile builder, public consent verification, and self-service dashboard. |
| [Admin Panel & Moderation](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/components/admin-panel.md) | Worker approval/rejection workflows, assisted/manual onboarding for blue-collar workers, categories, and report handling. |
| [Sircilla Local Specifications](file:///c:/Users/Barma%20manohar/Documents/work-sircilla(tempname)/wiki/components/sircilla-local-specs.md) | Textile & Powerloom trade definitions, Telugu-English bilingual UI guidelines, and Rajanna Sircilla locality hierarchy. |

---

## 🎯 Core Product Tenets

1. **100% Free & Direct:** No commissions, no middleman, no lead fees, no hidden numbers.
2. **Zero Login Friction for Customers:** Customers can immediately browse, search, call, and WhatsApp workers without registration.
3. **Explicit Worker Consent:** Phone numbers are displayed publicly only after explicit worker agreement during verification.
4. **Local & Bilingual First:** Sircilla-tailored categories (Powerloom trades) with accessible Telugu and English text and clear visual icons.
5. **Pragmatic Engineering:** Single cohesive Next.js + Prisma application with Docker development and serverless PostgreSQL production. No bloated microservices.
