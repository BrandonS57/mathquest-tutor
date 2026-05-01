# MathQuest 🚀 — Saxon 7/6 AI Math Tutor

An AI-powered math tutor for 6th graders using the Saxon Math 7/6 curriculum. Gamified, Socratic, and built to motivate a kid who loves real-world problems.

---

## Features

- **Daily Quest (Push Mode)** — 5 new real-world problems every day across fractions, decimals, percents, ratios, and geometry
- **Ask Tutor (Pull Mode)** — Socratic chat: guides, never gives away answers
- **Voice input** — speak questions aloud (Chrome/Edge)
- **XP, levels, streaks, badges** — full gamification
- **Anti-cheat** — AI redirects attempts to shortcut answers
- **35+ problems** aligned to Saxon Math 7/6 curriculum

---

## Setup (5 minutes)

### Step 1: Install Node.js
Download and install from **https://nodejs.org** (choose the "LTS" version).

### Step 2: Get an Anthropic API Key
1. Go to **https://console.anthropic.com**
2. Sign in or create a free account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

### Step 3: Set up the project
Open a terminal in this folder and run:

```bash
npm install
```

### Step 4: Add your API key
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
Open `.env` and replace `your_api_key_here` with your actual key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3000
```

### Step 5: Start it
```bash
npm start
```

Then open your browser to: **http://localhost:3000**

---

## Running it every day

Just open a terminal in the `math-tutor` folder and run:
```bash
npm start
```
Then go to **http://localhost:3000** in any browser.

To stop it: press `Ctrl+C` in the terminal.

---

## Deploy for a permanent URL (optional)

To give him a URL that works anytime without running a local server:

### Railway (free tier, easiest)
1. Go to **https://railway.app** and sign up with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Upload this folder or push it to a GitHub repo
4. Add the environment variable `ANTHROPIC_API_KEY` in Railway's settings
5. Railway gives you a permanent `https://your-app.railway.app` URL

### Render (also free)
1. Go to **https://render.com**
2. New → Web Service → connect your repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add `ANTHROPIC_API_KEY` in Environment settings

---

## How the AI Tutor Works

**Daily Quest (Push Mode):** Problems are chosen daily by category (fractions, decimals, percents, ratios, geometry). The AI evaluates answers and gives specific feedback — celebrating correct answers or nudging with hints when wrong. It never just gives the answer.

**Ask Tutor (Pull Mode):** Fully Socratic. The AI asks ONE guiding question at a time. If he tries to get a direct answer ("just tell me!"), the tutor gently redirects. It celebrates every small correct step.

**Anti-cheat detection:** Built into the AI system prompt — it recognizes phrases like "just tell me," "what is the answer," "I give up," and redirects back to guiding questions.

---

## Curriculum Coverage (Saxon Math 7/6)

| Topic | Problems |
|-------|----------|
| Fractions (add, subtract, multiply, divide) | 6 problems |
| Decimals (all operations, real-world) | 5 problems |
| Percents (find %, percent change, tips) | 7 problems |
| Ratios & Proportions | 6 problems |
| Geometry (area, perimeter, volume) | 6 problems |
| Mixed Word Problems | 5 problems |

---

## Gamification

| Element | Details |
|---------|---------|
| XP | +10/+20/+30 per correct answer by difficulty |
| Levels | 10 levels from "Math Cadet" to "Math Master" |
| Day Streak | 🔥 tracked daily, shown in header |
| Badges | 12 badges to earn |
| Confetti | Fires on correct answers |
| Progress Stars | 5 stars for each daily quest |
