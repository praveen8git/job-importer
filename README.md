# 🚀 Scalable Job Importer – MERN Stack Assignment

A full-stack job importer that:
- Fetches jobs from external XML APIs
- Converts and imports jobs into MongoDB
- Uses Redis and BullMQ for queue-based processing
- Tracks import history
- Updates the frontend in real-time via Socket.IO
- Supports cron-based automation and manual triggers

---

## 🛠 Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Queue:** BullMQ + Redis
- **Real-time:** Socket.IO

---

## 📂 Project Structure

```
job-importer-assignment/
├── client/             # React app
├── server/             # Express backend
│   ├── jobs/           # BullMQ producer/worker
│   ├── services/       # XML fetch + transform
│   ├── models/         # Mongoose models
│   ├── routes/         # API endpoints
│   ├── controllers/    # Route handlers
│   ├── cron/           # Cron job file
│   ├── config/         # Mongo & Redis config
│   ├── index.js        # Entry point
│   └── app.js
├── docs/               # Architecture & design notes
├── .env                # Environment variables
├── README.md
```

---

## 📦 Setup Instructions

### 🧱 Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud)

---

### ⚙️ Backend

```bash
cd server
npm install
cp .development.env.example .development.env  # Fill in values
npm run dev            # Starts Express + cron
```

---

### 💻 Frontend

```bash
cd client
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 📈 Features

- ✅ Import jobs from multiple XML feeds
- ✅ Background job queue with concurrency
- ✅ Real-time updates on job import completion
- ✅ Import history dashboard with filters
- ✅ Cron job runs every hour
- ✅ Manual trigger with button
- ✅ Full modular architecture

---

## 🚀 Bonus Features

- Real-time notifications via Socket.IO
- `useMemo` and `useCallback` optimizations in React
- Live feed of job import status
- Clean codebase with modular separation

---

## 🧪 Testing

- Run `node server/test/queueTest.js` for manual job queue testing
- Use browser devtools to inspect Socket.IO events

---

