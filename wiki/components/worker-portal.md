# Component: Worker Portal & Registration

## 1. Overview
The **Worker Portal** enables skilled individuals to create, manage, and maintain their public directory profiles. The user experience is tailored specifically for blue-collar professionals with simple step-by-step guidance, clear Telugu instructions, and minimum form fatigue.

---

## 2. Authentication Flow (Mobile OTP)

```
[ Worker enters Mobile Number ]
              |
              v
[ System sends 6-digit OTP ]
(Dev: Mock OTP 123456 / Prod: Fast2SMS or Twilio)
              |
              v
[ Worker submits OTP ]
              |
     +--------+--------+
     |                 |
(First Time)     (Returning User)
     v                 v
[ Registration ] [ Worker Dashboard ]
```

* **No Password Fatigue:** Workers never need to remember passwords or email addresses.
* **Session Persistence:** Secure HTTP-only JWT session cookie.
* **Duplicate Prevention:** If a mobile number already exists, the worker is logged into their existing profile instead of creating duplicates.

---

## 3. Multi-Step Profile Registration Flow

### Step 1: Mobile Verification
* Worker enters 10-digit Indian phone number (`+91`).
* OTP is dispatched and verified with a 5-minute timeout.

### Step 2: Basic Details & Photo
* Full Name
* Profession / Primary Category
* Profile Photo (direct upload, auto-compressed to WebP)
* Years of Experience
* Spoken Languages (Telugu, Hindi, English, Urdu)
* Locality / Colony in Sircilla

### Step 3: Specific Skills & Services
* Interactive tag selector for specific tasks (e.g. Electrician: *Wiring*, *Fan Repair*, *Inverter Setup*, *Submersible Starter*).
* Custom skill add option if not in the default list.

### Step 4: Contact & WhatsApp Info
* Call phone number (defaults to login mobile).
* Optional WhatsApp number (can be different or same).

### Step 5: Mandatory Legal & Privacy Consent
Worker must explicitly check two mandatory statements before submission:
1. *"I agree to publicly display my phone number so local customers can contact me directly."*
2. *"I confirm that the trade details and information provided are accurate."*

---

## 4. Worker Self-Service Dashboard (`/dashboard`)

Once registered, workers can:
* **Review Verification Status:**
  * 🟡 **Pending Approval:** *"Your profile is under review by our local community team."*
  * 🟢 **Approved & Active:** Public link preview + 1-tap WhatsApp sharing link.
  * 🔴 **Changes Requested / Rejected:** Clear reason provided (e.g., *"Please upload a clear photo of yourself"*).
* **Live Inquiries Counter:**
  * Displays Profile Views, Calls Initiated, and WhatsApp clicks.
* **Self-Deactivation ("Pause Profile"):**
  * Allows workers to temporarily hide their profile when out of town, ill, or overloaded with work, without losing their profile history.
* **Edit Profile:** Update skills, locality, or contact phone at any time.
