# Component: Intent Analytics & Click Tracker

## 1. Problem Statement
The directory is strictly **login-free for customers**. We do not force customers to sign up, nor do we route phone calls through intermediate telecommunication proxies (which costs money and compromises privacy). 

However, workers and platform administrators need to understand:
* How many customers viewed a worker's profile?
* How many customers clicked **"Call"** (`tel:`)?
* How many customers clicked **"WhatsApp"** (`wa.me`)?
* How many times was a worker's profile shared to local WhatsApp groups?

---

## 2. Solution: Non-Blocking Intent Beacon Pattern

When a customer taps any contact or share button, the application tracks the **intent** asynchronously using the browser's native `navigator.sendBeacon` API or a keepalive `fetch`. 

This guarantees:
1. **Zero Customer Latency:** The customer's mobile dialer or WhatsApp client opens immediately with 0ms delay.
2. **Reliable Transmission:** The beacon completes even as the browser window shifts focus to the dialer or WhatsApp app.

### Client-Side Action Handler (`lib/analytics/tracker.ts`)

```typescript
export function trackWorkerInteraction(workerId: string, action: 'CALL' | 'WHATSAPP' | 'SHARE' | 'VIEW') {
  // 1. Client-Side Session Throttling
  const sessionKey = `track_${workerId}_${action}`;
  const lastTracked = sessionStorage.getItem(sessionKey);
  const now = Date.now();

  // Throttle repeated clicks within 10 minutes in the same session
  if (lastTracked && now - parseInt(lastTracked, 10) < 10 * 60 * 1000) {
    return;
  }
  sessionStorage.setItem(sessionKey, now.toString());

  // 2. Transmit via sendBeacon or Fetch keepalive
  const url = '/api/analytics/track';
  const payload = JSON.stringify({ workerId, action });

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
  } else {
    fetch(url, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  }
}
```

---

## 3. Server-Side Protection & Bot Filtering (`/api/analytics/track`)

To prevent fake inflated metrics without requiring login:

1. **Bot & Crawler Filter:**
   Requests with `User-Agent` matching search crawlers (`Googlebot`, `bingbot`, `YandexBot`, `crawler`) are rejected immediately.
2. **Ephemeral Rate-Limiting Hash:**
   Generate a daily transient hash `SHA256(ClientIP + WorkerID + Action + YYYY-MM-DD)`. Only increment the database if this action hasn't been recorded in an in-memory/cache window.
3. **Privacy Compliance:**
   Raw IP addresses and user agents are **never stored permanently** in the database.

---

## 4. Dual Database Update Strategy

To maintain high query performance without expensive `COUNT(*)` calculations:

1. **Atomic Aggregate Increment (Instant reads):**
   ```typescript
   await prisma.worker.update({
     where: { id: workerId },
     data: {
       callClicks: action === 'CALL' ? { increment: 1 } : undefined,
       whatsappClicks: action === 'WHATSAPP' ? { increment: 1 } : undefined,
       shareClicks: action === 'SHARE' ? { increment: 1 } : undefined,
       profileViews: action === 'VIEW' ? { increment: 1 } : undefined,
     },
   });
   ```
2. **Granular Event Entry (For trend graphs):**
   ```typescript
   await prisma.workerInteraction.create({
     data: {
       workerId,
       type: action,
     },
   });
   ```

---

## 5. Value Presentation

* **Worker Dashboard:** Displays transparent terminology: *"Contact Inquiries Initiated"* (8 calls, 5 WhatsApp messages).
* **Homepage Social Proof:** Shows the aggregate city counter: *"Over 1,200 local connections made in Sircilla!"*
