# Component: Customer Directory & Search

## 1. Overview
The **Customer Directory** is the primary public-facing surface of the application. It allows any resident of Sircilla or nearby areas to discover skilled workers, inspect their experience and skills, and initiate direct communication via phone dialer or WhatsApp.

---

## 2. Key Pages & Routes

| Route | Purpose | SEO / Metadata |
| :--- | :--- | :--- |
| `/` | Homepage with hero search, bilingual category grid, and popular local trades. | Static + Revalidated SSR. |
| `/search` | Dynamic search results with category & locality filter drawer. | Search indexable with query params. |
| `/category/[slug]` | Category-specific landing pages (e.g., `/category/electrician`). | Pre-rendered with dynamic metadata. |
| `/worker/[slug]` | Public worker profile with 1-tap Call and WhatsApp buttons. | Canonical SEO title & JSON-LD `LocalBusiness`/`Person`. |

---

## 3. Direct Contact Actions (Call & WhatsApp)

### A. One-Tap Phone Call
* **Target Protocol:** `tel:+91XXXXXXXXXX`
* **UX:** Primary green high-contrast button placed prominently within thumb-reach on mobile screens.
* **Fallback / Desktop:** On desktop or non-telephony devices, clicking displays a clear confirmation modal showing the full phone number for manual dialing.

### B. One-Tap WhatsApp Deep Link
* **Target URL Format:**
  ```
  https://wa.me/91XXXXXXXXXX?text=Hello%20Ramesh%2C%20I%20found%20your%20profile%20on%20Local%20Worker%20Directory%20(Sircilla).%20I%20need%20your%20service.
  ```
* **Telugu-friendly prefilled greeting option:**
  ```
  నమస్తే, నేను లోకల్ వర్కర్ డైరెక్టరీలో మీ ప్రొఫైల్ చూశాను. నాకు మీ పని కావాలి.
  ```

### C. WhatsApp Profile Share Button
Allows customers to forward a worker's profile directly to friends, family, or neighborhood groups:
```
https://api.whatsapp.com/send?text=Check%20out%20this%20electrician%20in%20Sircilla:%20https://sircillaworkers.in/worker/ramesh-kumar-electrician
```

---

## 4. Search & Filter Architecture

### Search Fields
* Worker Name (fuzzy case-insensitive match)
* Profession / Trade (Bilingual English + Telugu matching)
* Skill tags (e.g., "Motor Rewinding", "Inverter Fitting")
* Locality (e.g., "Gandhi Nagar", "Vidya Nagar")

### Mobile Filter Drawer
* Designed for 360px+ viewport widths.
* Sticky bottom action bar with clear touch targets.
* Infinite scroll / "Load More" pagination (20 workers per page) to prevent high data consumption on 3G/4G connections.
