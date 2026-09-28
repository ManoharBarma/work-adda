# Component: Admin Panel & Moderation

## 1. Overview
The **Admin Panel** (`/admin`) is a secure, role-protected interface designed for community managers, local volunteers, and platform administrators. It provides full control over content moderation, category management, and community reports.

---

## 2. Key Administrative Modules

### A. Worker Moderation Queue
* **Pending Tab:** Displays newly submitted worker profiles requiring review.
  * Preview worker details, photo, and skills.
  * One-click **Approve** (instantly sets `status = APPROVED` and generates public slug).
  * One-click **Reject** with structured reason templates:
    * *"Phone number could not be reached / verified."*
    * *"Duplicate profile detected."*
    * *"Profile photo is unclear or inappropriate."*
    * *"Information incomplete or inaccurate."*
* **Active Workers Tab:** Filter by category or search by name/phone. Allows instant deactivation or suspension if reports are substantiated.

### B. Assisted / Manual Worker Onboarding
> **Crucial Sircilla Feature:** Many local blue-collar workers (masons, welders, loom mechanics) may not be digitally literate enough to fill multi-step online forms.

* Administrators or community volunteers can onboard workers directly from the admin panel:
  * Admin fills in the worker's name, phone, trade, and locality.
  * Admin checks the verbal consent acknowledgement.
  * Worker profile can be marked directly as approved or queued for review.

### C. Category & Trade Management
* Add, edit, reorder, or deactivate service categories.
* Configure English and Telugu bilingual titles.
* Assign emoji/SVG icons for visual recognition on the homepage.

### D. Community Reports Queue
* Public profiles feature a "Report this Profile" button.
* Admin views aggregated reports with reason counts:
  * Incorrect / switched-off phone number
  * Wrong trade listed
  * Abusive or fake listing
* Admin can click to contact the worker, mark report resolved, or suspend the profile.
