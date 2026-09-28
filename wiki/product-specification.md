Yes. Since you're using **Antigravity IDE**, the best approach is to give it a detailed product/engineering specification and let it generate the initial application, then iterate feature-by-feature.

Below is a **master prompt** you can paste into Antigravity. It deliberately keeps the first version simple. No microservice circus.

# Local Worker Directory

## Master Product & Development Specification

Build a production-quality, mobile-first web application for a free local skilled-worker directory.

Working name: **Local Worker Directory**

The application will initially launch in **Sircilla, Telangana, India** and should be designed so it can later expand to other towns, districts and states.

The fundamental concept is extremely simple:

> Help people find local skilled workers and directly contact them by phone or WhatsApp.

There are NO commissions, NO contact-number hiding, NO booking system, NO payments and NO middleman.

A customer searches for a service, opens a worker profile, and directly calls or WhatsApps the worker.

---

# 1. PRODUCT PRINCIPLES

The entire application must follow these principles:

1. Completely free for workers.
2. Completely free for customers.
3. Worker phone numbers are intentionally visible.
4. Customers can directly call workers.
5. Customers can directly WhatsApp workers.
6. No commission.
7. No lead-generation fees.
8. No paid ranking.
9. No advertisements in the initial version.
10. Mobile-first.
11. Extremely simple UI.
12. Telugu + English support should be considered from the architecture stage.
13. Do not collect unnecessary personal information.
14. Do not collect Aadhaar numbers.
15. Do not collect bank information.
16. Do not expose exact home addresses.
17. Workers must explicitly consent to public display of their phone number.
18. Profiles must be searchable by profession/category and locality.

The product should feel more like a useful local directory than a complicated marketplace.

---

# 2. TARGET USERS

There are two main user types.

## Customer

A person looking for:

* Electrician
* Plumber
* Carpenter
* Mechanic
* Welder
* AC technician
* RO technician
* Appliance repair
* Agricultural machinery repair
* etc.

Customers should NOT need an account to browse workers.

They should be able to:

1. Open website.
2. Select service/category.
3. Select locality if necessary.
4. Search.
5. Open worker profile.
6. Call.
7. WhatsApp.

The customer experience must be frictionless.

---

## Worker

A skilled worker who wants to be listed.

Worker can:

1. Register using mobile number + OTP.
2. Create profile.
3. Select profession.
4. Select skills/services.
5. Add locality.
6. Add experience.
7. Upload profile photo.
8. Add WhatsApp number.
9. Give consent for public contact information.
10. Submit profile.
11. Edit profile later.

Worker profiles should require admin approval before becoming publicly searchable.

---

# 3. INITIAL CATEGORIES

Create a category system.

## Home Services

* Electrician
* Plumber
* Carpenter
* Painter
* Mason
* AC Technician
* RO Technician
* Washing Machine Repair
* Refrigerator Repair
* Appliance Repair
* Cleaning Services

## Automotive

* Bike Mechanic
* Car Mechanic
* Auto Electrician
* Tyre/Puncture
* Car Wash
* Towing
* Battery Services

## Agriculture

* Tractor Operator
* Tractor Mechanic
* Agricultural Machinery Repair
* Borewell Technician
* Pump/Motor Mechanic
* Sprayer Operator
* Farm Equipment Services
* Agricultural Labour

## Skilled Trades

* Welder
* Fabricator
* Aluminium Worker
* Tile Worker
* Glass Worker
* POP Worker
* Steel Worker

## Personal Services

* Tailor
* Barber
* Beautician
* Photographer
* Cook
* Caterer

## Other

* Other Services

The admin must be able to create/edit/deactivate categories later.

Do not hardcode categories throughout the application.

Store them in the database.

---

# 4. LOCALITY SYSTEM

The initial location should be:

Country:
India

State:
Telangana

District:
Rajanna Sircilla

Town:
Sircilla

Allow locality/area to be selected.

Examples:

* Gandhi Nagar
* Vidya Nagar
* Ramnagar
* Market Area
* Nearby villages
* Other

The locality system must be database-driven.

Do NOT build a complicated GPS system in version 1.

The user should be able to select:

State → District → Town → Locality

Later the system can expand to:

Telangana → Karimnagar → Hyderabad → etc.

---

# 5. HOMEPAGE

Create a very clean mobile-first homepage.

Hero section:

"Find Local Workers Near You"

Subtitle:

"Find skilled workers in your area and contact them directly."

Large search box:

"Search for a service..."

Examples:

Electrician
Plumber
Mechanic
Welder

Below it:

"Browse Categories"

Display category cards/icons.

Example:

⚡ Electrician
🔧 Plumber
🪚 Carpenter
❄️ AC Technician
🚗 Mechanic
🌾 Agriculture
🔨 Welder
🧹 Cleaning

Then:

"Popular Local Services"

Show worker/category cards.

Then:

"Are you a skilled worker?"

CTA:

"Register Your Profile — Free"

Footer:

About
Register as Worker
Contact
Privacy
Terms

---

# 6. CUSTOMER SEARCH

Customer should be able to search without logging in.

Search should support:

* Worker name
* Profession
* Skill
* Locality

Examples:

"electrician"

"Ramesh"

"pump mechanic"

"Sircilla electrician"

Do not require exact spelling.

Use case-insensitive matching.

Search results should display:

Worker photo
Name
Profession
Locality
Experience
Selected skills
Verification badge
Call button
WhatsApp button

Example:

---

Ramesh Kumar

⚡ Electrician

📍 Sircilla · Gandhi Nagar

12 years experience

House Wiring
Motor Repair
Inverter Installation

✓ Mobile Verified
✓ Community Registered

[ CALL ] [ WHATSAPP ]

---

---

# 7. FILTERS

Provide simple filters.

Category

Locality

Experience

Verification status

Do NOT create dozens of filters.

Mobile UI should use a simple filter drawer.

---

# 8. WORKER PROFILE PAGE

Each worker must have a public URL.

Example:

/worker/ramesh-kumar-electrician

Profile:

Large profile photo

Name

Profession

Locality

Experience

Languages

Skills

Description

Verification status

Optional work photos

Phone number

WhatsApp number

Large buttons:

[ 📞 CALL ]

[ 💬 WHATSAPP ]

The phone number should be visible.

Example:

📞 +91 XXXXX XXXXX

Do NOT hide it behind "Get Number".

---

# 9. CALL BUTTON

Use:

tel:

When clicked on mobile, open the phone dialer.

Example concept:

tel:+919XXXXXXXXX

---

# 10. WHATSAPP BUTTON

Use WhatsApp deep link.

Example:

[https://wa.me/91XXXXXXXXXX](https://wa.me/91XXXXXXXXXX)

The WhatsApp message should optionally be prefilled:

"Hello, I found your profile on Local Worker Directory. I need your service."

Do not use a third-party WhatsApp API.

Simply use the public WhatsApp link.

---

# 11. WORKER REGISTRATION

Create:

/register

Step 1:

Mobile number

Send OTP

Step 2:

Basic details

Full name
Profile photo
Profession
Experience
Languages
Town
Locality

Step 3:

Services/skills

Allow multiple selections.

Step 4:

Contact details

Phone number
WhatsApp number

Step 5:

Consent

Mandatory checkbox:

"I agree to publicly display my phone number so customers can contact me directly."

Also:

"I confirm that the information provided is accurate to the best of my knowledge."

Submit.

After submission:

"Your profile has been submitted for approval."

---

# 12. WORKER DASHBOARD

Create:

/dashboard

Worker can see:

Profile status:

Pending
Approved
Rejected
Needs Update

Profile preview

Edit Profile

Update Photo

Update Phone

Update Skills

Manage Work Photos

Hide Profile

Delete Account

Worker should be able to deactivate their public listing.

---

# 13. ADMIN PANEL

Create a protected admin area:

/admin

Dashboard:

Total workers
Approved workers
Pending workers
Inactive workers
Categories
Localities
Reports

Worker management:

Search workers.

Filters:

Pending
Approved
Rejected
Inactive

Actions:

View
Approve
Reject
Edit
Deactivate
Delete

Admin should be able to add/edit/delete categories.

Admin should be able to add/edit localities.

---

# 14. APPROVAL SYSTEM

Every new worker profile starts:

status = pending

Only approved workers appear publicly.

Admin approves.

Then:

status = approved

Rejected:

status = rejected

Worker should see the reason for rejection if provided.

Possible rejection reason:

"Phone number could not be verified."

"Duplicate profile."

"Information incomplete."

---

# 15. VERIFICATION BADGES

Use simple badges.

### Mobile Verified

Worker successfully verified their mobile number.

### Community Registered

Profile was registered/verified through the local community.

Do NOT claim:

"Government Verified"

unless there is actual government verification.

Do NOT invent certification.

---

# 16. REPORT PROFILE

Every public profile should have:

"Report this profile"

Report reasons:

* Wrong phone number
* Fake profile
* Wrong profession
* Inappropriate content
* Person no longer provides this service
* Duplicate profile
* Other

Admin can see reports.

Do not expose reporter identity publicly.

---

# 17. PROFILE STATUS

Worker profile states:

pending
approved
rejected
inactive
suspended

Only:

approved

profiles appear in normal public search.

---

# 18. DUPLICATE PREVENTION

Phone number should be unique.

Before creating a new worker:

Check whether the phone number already exists.

If it exists:

"An account already exists with this mobile number."

Do not create duplicate profiles.

Admins should have a way to merge/delete duplicates later.

---

# 19. PRIVACY

Collect only necessary information.

DO NOT collect:

Aadhaar number
PAN
Bank account
UPI ID
Exact home address
Date of birth
Sensitive documents

Public profile should contain:

Name
Photo
Profession
Skills
Experience
Locality
Languages
Phone
WhatsApp

The worker must explicitly consent to public contact details.

Provide:

"Hide my profile"

and:

"Delete my account"

---

# 20. DATA MODEL

Use a relational database.

Suggested tables:

users

workers

categories

skills

worker_skills

locations

worker_locations

work_photos

reports

admin_users

otp_verifications

audit_logs

Suggested worker fields:

id
user_id
full_name
slug
profile_photo_url
profession/category_id
experience_years
description
languages
phone
whatsapp_phone
state
district
town
locality
status
mobile_verified
community_verified
public_phone_consent
created_at
updated_at

---

# 21. AUTHENTICATION

Worker login:

Mobile number + OTP.

Customers do NOT need authentication.

Admin:

Email/password initially.

Use secure password hashing.

Do not store raw passwords.

For development, OTP can use a mock/dev provider.

For production, use a legitimate SMS/OTP provider.

Do not build fake OTP security for production.

---

# 22. TECHNOLOGY

Choose a simple modern stack.

Preferred:

Frontend:
Next.js + TypeScript

Styling:
Tailwind CSS

Backend:
Next.js API routes/server actions OR a simple backend within the same application.

Database:
PostgreSQL

ORM:
Prisma

Authentication:
Use a simple reliable authentication solution compatible with mobile OTP.

Storage:
Object storage for profile/work images.

Deployment:
Production Web & API: Vercel (Hobby plan, 100% free)
Production Database: Neon.tech (Serverless PostgreSQL, free tier)
Media Storage: Cloudinary (Free tier)

Local Development & Containers:
Docker & Docker Compose running inside WSL (Ubuntu 24.04).
PostgreSQL running via Docker container locally for offline testing.

Do NOT split into microservices.
Do NOT create Kubernetes infrastructure.
Do NOT introduce Redis unless actually needed.
Do NOT create Kafka.
Do NOT over-engineer.
One application + one database is sufficient.

---

# 23. PWA

Make the application a Progressive Web App.

Requirements:

Mobile responsive
Fast loading
Installable on Android
Works well on low-end mobile devices
Large touch targets
Minimal JavaScript where possible
Optimized images

The customer should feel like they are using a lightweight mobile app.

Do not require the Play Store for version 1.

---

# 24. DESIGN

Design language:

Clean
Simple
Friendly
Local
Trustworthy

Avoid:

Corporate SaaS appearance
Huge gradients
Excessive animations
Complicated dashboards
Tiny text
Huge amounts of empty space

Use clear category icons.

Use large Call and WhatsApp buttons.

Accessibility:

Good contrast
Readable font
Large buttons
Clear labels
Keyboard accessible
Screen-reader friendly where practical

---

# 25. MOBILE FIRST

Design at:

360px width first.

Then:

390px
414px
768px
1024px
Desktop

Customer profile should be particularly optimized for mobile.

On mobile:

Call and WhatsApp buttons should be easy to reach with one thumb.

---

# 26. SEO

Every public worker profile should be indexable.

Example:

/worker/ramesh-kumar-electrician

Generate:

title:

"Ramesh Kumar - Electrician in Sircilla | Local Worker Directory"

description:

"Contact Ramesh Kumar, an electrician in Sircilla. View services, experience and contact information."

Category pages should also be indexable.

Example:

/sircilla/electricians

/sircilla/plumbers

/sircilla/mechanics

This is important because someone searching Google for:

"electrician in Sircilla"

should potentially find the directory.

---

# 27. PERFORMANCE

Target:

Fast first load on mobile networks.

Optimize:

Images
Fonts
JavaScript
Database queries

Use pagination.

Do not load hundreds of worker profiles simultaneously.

Initial search:

20 workers per page.

Provide pagination or "Load more".

---

# 28. SECURITY

Implement:

Input validation
Rate limiting
Authentication protection
Authorization
CSRF protection where applicable
Secure cookies
Password hashing
SQL injection protection through ORM
File upload validation
Image size limits
File type validation

Do not trust user-submitted filenames.

Do not expose internal database IDs unnecessarily.

Use slugs for public worker URLs.

---

# 29. ADMIN SECURITY

Admin routes must be protected.

A normal worker must never be able to access:

/admin

Worker must never be able to approve themselves.

Workers can edit their own profiles only.

They cannot edit another worker.

Implement server-side authorization, not only frontend hiding.

---

# 30. IMAGE UPLOADS

Profile photo:

Maximum recommended size:
2–5 MB upload

Resize/compress server-side.

Allowed:

JPG
JPEG
PNG
WebP

Work photos:

Maximum 5 initially.

Compress images.

Generate thumbnails.

---

# 31. ANALYTICS

Keep analytics simple.

Track:

Profile views
Call button clicks
WhatsApp button clicks
Searches
Category views

Do not initially build complicated user tracking.

Important metric:

Number of direct contacts generated.

---

# 32. HOME PAGE SEO CONTENT

Include simple explanation:

"Find skilled workers in Sircilla"

"Electricians, plumbers, mechanics, welders, carpenters and other local service providers."

"Contact workers directly by phone or WhatsApp."

"Free for workers and customers."

This should make the purpose immediately clear.

---

# 33. ABOUT PAGE

Explain:

Local Worker Directory is a free community initiative that helps people discover skilled workers in their locality.

Workers can create a free profile.

Customers can directly contact workers.

There are no commissions and no hidden contact numbers.

The project initially focuses on Sircilla and may expand to other locations.

---

# 34. IMPORTANT PRODUCT RULES

Never:

Hide phone numbers.

Force customers to create accounts.

Force customers to use an internal chat.

Charge workers for leads.

Rank workers based on payment.

Sell worker phone numbers.

Sell personal information.

Claim government endorsement without authorization.

Claim skill verification without actual verification.

Add unnecessary AI features just for marketing.

---

# 35. MVP PHASE

Build ONLY these features first:

### Public

Homepage
Categories
Search
Filters
Worker list
Worker profile
Call
WhatsApp

### Worker

Mobile OTP login
Registration
Profile creation
Profile editing
Profile status

### Admin

Admin login
Worker approval
Worker editing
Worker deletion/deactivation
Category management
Report management

### Infrastructure

PostgreSQL
Image storage
PWA
SEO
Basic analytics
Security

Do NOT implement future features yet.

---

# 36. FUTURE FEATURES

Do not build these now.

Potential future additions:

Customer reviews
Verified work history
Community verification
Worker QR cards
Worker portfolio
Service availability
Maps
Nearby search
Multiple towns
Telugu voice registration
AI-assisted profile creation
Government scheme integration
Training/certification links
Employer recruitment
Worker referrals

These are future roadmap items only.

---

# 37. DEVELOPMENT APPROACH

Build in stages.

## Stage 1

Create project structure.

Set up:

Next.js
TypeScript
Tailwind
Prisma
PostgreSQL
Environment configuration

Create database schema.

---

## Stage 2

Build public homepage.

Build categories.

Build search.

Build worker listing.

Build worker profile.

Implement Call and WhatsApp buttons.

---

## Stage 3

Build worker authentication.

Mobile OTP.

Worker registration.

Profile editing.

Profile status.

---

## Stage 4

Build admin dashboard.

Worker approval.

Category management.

Report management.

---

## Stage 5

Add:

PWA
SEO
Image optimization
Security
Responsive testing
Performance optimization

---

## Stage 6

Seed development database with sample workers.

Use clearly fictional sample data.

Do not use real people's phone numbers in development seed data.

---

# 38. TESTING REQUIREMENTS

Test:

Worker registration.

Duplicate phone registration.

Invalid phone number.

OTP expiry.

Worker editing.

Unauthorized profile editing.

Admin approval.

Admin rejection.

Public visibility.

Inactive worker.

Search.

Category filtering.

Locality filtering.

Call button.

WhatsApp button.

Broken image.

Large image.

Mobile layout.

Desktop layout.

404 worker profile.

Deleted worker.

Reported worker.

Unauthorized admin access.

---

# 39. FINAL ACCEPTANCE CRITERIA

The MVP is complete when:

1. A customer can open the website without logging in.
2. Customer can find a category.
3. Customer can search workers.
4. Customer can filter by locality.
5. Customer can open a worker profile.
6. Customer can see the worker's phone number.
7. Customer can call with one tap.
8. Customer can WhatsApp with one tap.
9. Worker can register using mobile authentication.
10. Worker can create their profile.
11. Worker can select multiple services.
12. Worker can upload a profile photo.
13. Worker can explicitly consent to public phone display.
14. Worker profile remains hidden until admin approval.
15. Admin can approve/reject profiles.
16. Admin can manage categories.
17. Users can report profiles.
18. Worker can deactivate their profile.
19. Website works properly on mobile.
20. Public worker profiles are SEO-friendly.
21. Application does not require customers to register.
22. There is no payment or commission system.
23. There is no contact-number masking.
24. No unnecessary personal information is collected.

---

# 40. DEVELOPMENT RULE

Before implementing a feature, ask:

> "Does this directly help a person find and contact a local worker?"

If NO:

Do not add it to MVP.

Keep the first version extremely small.

The goal is not to build a giant marketplace.

The goal is to create the simplest useful local worker directory possible.

---

# 41. WSL RUNTIME & EXECUTION RULES (CRITICAL)

All project execution, Node commands, package management, Prisma migrations, and Docker operations MUST be executed inside WSL, NOT directly in the Windows host shell.

1. Operating System: WSL (Ubuntu 24.04 LTS).
2. WSL User: `manu` (configured in the `docker` group for rootless docker execution).
3. Node Version: Node.js v20.20.2 LTS.
4. Package Manager: npm 10.8.2.
5. Docker & Compose: Docker Engine v29.1.3 + Docker Compose v2.40.3 installed in WSL.
6. Execution Rule for Agent: Always prefix terminal commands with `wsl -d Ubuntu -u manu -- bash -ic "<command>"` or run them inside WSL bash.

---

# 42. CONTAINERIZATION (DOCKER FOR LOCAL TESTING)

Include Docker support for local development and offline testing:

1. `docker-compose.yml`:
   - Runs a local PostgreSQL 16 container (`postgres:16-alpine`).
   - Default local port: `5432`.
   - Persistent volume for database data (`postgres_data`).
   - Environment variables for local dev database credentials.
2. `Dockerfile`:
   - Production-ready multi-stage Dockerfile using Next.js `output: 'standalone'`.
   - Allows running the entire web application and backend in a lightweight container if ever migrating away from Vercel to a VPS.
3. Database Switching:
   - Development can seamlessly toggle between local Docker PostgreSQL (`localhost:5432`) and cloud Neon PostgreSQL by switching `DATABASE_URL` in `.env`.

---

# 43. 100% FREE CLOUD HOSTING & SETUP LINKS

The production deployment runs completely on verified zero-cost free tiers:

1. Code Repository:
   - Platform: GitHub
   - Link: https://github.com/signup
   - Purpose: Version control and auto-deploy webhook trigger for Vercel.

2. Web App Hosting & Serverless API:
   - Platform: Vercel (Hobby Tier - Free)
   - Link: https://vercel.com/signup (Sign up with GitHub)
   - Purpose: Hosts Next.js frontend and serverless API with free SSL and `*.vercel.app` domain.

3. Cloud Database:
   - Platform: Neon.tech (Serverless PostgreSQL - Free Tier)
   - Link: https://neon.tech
   - Purpose: 0.5 GB serverless PostgreSQL with connection pooling, compatible with Prisma. Does not expire.

4. Image & Media Storage:
   - Platform: Cloudinary (Free Tier)
   - Link: https://cloudinary.com/users/register_free
   - Purpose: Auto-compresses and serves worker profile photos in WebP format.

---

# 44. SIRCILLA LOCAL ENHANCEMENTS & REFINEMENTS

Refinements tailored for Sircilla, Telangana:

1. Assisted / Admin Worker Onboarding:
   - Blue-collar workers may struggle with digital forms.
   - Admin panel must support manual worker entry by an admin or local community volunteer on the worker's behalf.
2. Telugu + English Bilingual Support:
   - Display prominent Telugu labels alongside English (e.g., `ఎలక్ట్రీషియన్ (Electrician)`, `ప్లంబర్ (Plumber)`).
   - Use clear, visual category icons for low-literacy users.
3. Textile & Powerloom Trade Category:
   - Sircilla is known as Telangana's Textile Town.
   - Include hyper-local textile trades: Powerloom Mechanic, Sizing/Warping Technician, Jacquard/Dobby Master, Loom Spare Parts Technician.
4. WhatsApp Profile Sharing:
   - Add a one-tap "Share Profile on WhatsApp" button so customers can easily recommend workers in local family and neighborhood WhatsApp groups.
5. Community Platform Disclaimer:
   - Include a clear footer disclaimer stating the platform is a free community directory connecting people directly and does not employ, guarantee, or supervise work.
