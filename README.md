# ✅ Smart Todo App

A **modern AI-powered To-Do application** with a premium dark UI, 3D metaverse background, GSAP animations, and Groq AI task generation.

![Smart Todo App](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![Three.js](https://img.shields.io/badge/3D-Three.js-black?style=flat-square&logo=three.js)
![GSAP](https://img.shields.io/badge/Animation-GSAP-88CE02?style=flat-square)
![Groq AI](https://img.shields.io/badge/AI-Groq-orange?style=flat-square)

---

## ✨ Features

- 🤖 **AI Task Generation** — Describe a goal, get smart tasks via Groq AI
- 🌐 **3D Metaverse Background** — Animated Three.js grid, particles & wireframe objects
- 🎬 **GSAP Animations** — Smooth page-load & task add/remove animations
- 🖱️ **Mouse Follower** — Portfolio-style cursor circle
- 🎨 **Priority Color System** — Low (green) / Medium (cyan) / High (purple) atmospheric glows
- 📅 **Due Dates** — Overdue detection & visual warning
- 🔍 **Search & Filter** — Real-time search + filter by priority/status
- 📊 **Progress Tracking** — Live completion bar with motivational messages
- 💾 **localStorage Persistence** — Tasks saved across sessions
- ✏️ **Double-click Edit** — Edit any task inline
- 📱 **Fully Responsive** — Works on mobile, tablet, desktop

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js + Express |
| Frontend | Vanilla HTML / CSS / JS |
| 3D Graphics | Three.js (r134) |
| Animations | GSAP 3.11 |
| AI | Groq API (OpenAI-compatible) |
| Styling | Custom CSS (dark theme) |

---

## 🚀 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/aasthamuskan/Smart_ToDo.git
cd Smart_ToDo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Groq API key

Create a `.env` file in the root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 🔑 Get your free API key at **[console.groq.com](https://console.groq.com)**

### 4. Start the server

```bash
npm start
```

App will be running at **http://localhost:3001**

---

## ☁️ Deploy on Render (Free)

> Render is the easiest free platform for Node.js apps with backend.

### Step-by-step:

1. Go to **[render.com](https://render.com)** → Sign up / Log in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `aasthamuskan/Smart_ToDo`
4. Fill in these settings:

| Field | Value |
|---|---|
| **Name** | `smart-todo-app` (or anything) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

5. Scroll down to **"Environment Variables"** → Add:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | `your_actual_groq_api_key` |

6. Click **"Create Web Service"**
7. Wait ~2-3 minutes → Your app is LIVE! 🎉

---

## 📁 Project Structure

```
Smart_ToDo/
├── public/
│   ├── index.html        # Main HTML
│   ├── style.css         # Premium dark UI styles
│   ├── script.js         # Todo logic + GSAP animations
│   └── bg-animation.js   # Three.js 3D metaverse background
├── server.js             # Express server + Groq AI endpoint
├── package.json
├── .env.example          # Template for environment variables
└── .gitignore
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for AI task generation |
| `PORT` | ❌ No | Port number (default: 3001) |

---

## 📸 Preview

> Dark atmospheric UI · 3D metaverse grid · Priority-based glows · AI task generation

---

## 📄 License

MIT — feel free to use, modify and share.
