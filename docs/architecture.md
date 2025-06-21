# 🧠 Architecture & Design – Job Importer Assignment

This document outlines the system design, data flow, and architectural decisions made during the implementation of the Job Importer application.

---

## 🏗️ System Overview

The system fetches job data from external XML feeds, transforms the data, and stores it in a MongoDB database via a Redis-based queue. Import operations are tracked and displayed in a real-time dashboard.

---

## 🧱 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Queue Processing:** BullMQ + Redis
- **Real-time Updates:** Socket.IO
- **Scheduler:** node-cron

---

## 🔁 Data Flow

```txt
[XML Feed] 
   ↓ fetchJobsFromFeed()
[Express API] or [Cron Job]
   ↓ enqueueJobs()
[Redis Queue] (BullMQ)
   ↓
[Worker] → MongoDB (insert/update Job)
   ↓
[ImportLog Created] → Emit 'import-complete' via Socket.IO
   ↓
[React Frontend] ← Receives real-time update and re-renders logs
```

---

## 🧠 Key Components

### 1. **Job Fetching Service**
- Uses `axios` + `xml2js` to parse remote XML job feeds
- Normalizes each job object (title, company, location, etc.)

### 2. **Queue & Worker**
- Jobs are enqueued via BullMQ
- Worker handles upserting jobs to MongoDB using `jobId` as unique key
- Prevents duplicates and supports retry handling

### 3. **Import Logs**
- For each feed processed, an `ImportLog` document is created
- Stores timestamp, totals, and failure metadata (if any)

### 4. **Cron Job**
- Uses `node-cron` to run imports hourly
- Triggers same logic used by manual imports
- Emits Socket.IO events when complete

### 5. **Real-Time Updates**
- Socket.IO is used for bi-directional communication
- Frontend listens for `import-complete` events and refreshes logs

---

## 🖼️ Suggested Diagram (for draw.io or Excalidraw)

```
Client (React)
   ↑
Socket.IO        REST API (Manual trigger)
   ↑                  ↑
Real-time       /api/import-jobs
   ↑                  ↑
Express Server (Node.js + Socket.IO)
   ↓
Cron Scheduler ───→ Job Fetcher
                        ↓
                    Queue Producer
                        ↓
                    BullMQ Queue
                        ↓
                      Worker
                        ↓
                 MongoDB (Jobs & Logs)
```

---

## ⚙️ Design Decisions

- **BullMQ + Redis** used for better control over concurrency and retries.
- **Socket.IO** chosen over SSE for broader browser and mobile support.
- **useMemo/useCallback** used in React to prevent re-renders and improve performance.
- Separated `cron/` folder to keep cron logic modular and testable.

---

## 📄 Notes

This project was built with scalability and modularity in mind. Each layer of the stack is isolated to simplify testing, maintenance, and future upgrades.

