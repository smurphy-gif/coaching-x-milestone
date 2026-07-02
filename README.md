# Coaching × Milestone

**Loan Officer coaching platform for Milestone Mortgage Solutions**

A single-coach web app for assigning coaching tasks and daily check-ins to
your loan officers, tracking who's completed what, sharing resources, and
posting announcements/DMs. All data lives in Monday.com — there's no
separate database or login system.

---

## ⚠️ Security note — read this first

This app talks to Monday.com directly from the browser using a personal API
token. That token can read and write your *entire* Monday account, and
because it's embedded in the app, anyone who opens their browser's dev
tools while using the app can see it.

That's a fine tradeoff for a small internal tool that only you (the coach)
use — which is how this is currently built. It is **not** safe to hand this
app's URL to your loan officers or anyone outside a small trusted circle.
If you later want each loan officer to log in and see only their own tasks,
that's a bigger change (you'd need to reintroduce some form of per-person
authentication, e.g. Supabase auth or Monday's own login) — just ask and
we can build that.

---

## 🚀 Setup Guide (Step by Step)

### Step 1: Get a Monday.com API token (2 minutes)

1. In Monday.com, click your avatar (bottom left) → **Administration** → **Connections** → **API**, or go to your profile → **Developers** → **My Access Tokens**
2. Copy your personal API token

### Step 2: Set up your `.env` file (1 minute)

1. In this project folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Paste your API token into `VITE_MONDAY_API_TOKEN`
3. The board IDs are already filled in — they point at the "Coaching x Milestone" workspace already created in your Monday account. Leave them as-is unless you rebuild the boards.

### Step 3: Install and run locally (2 minutes)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the dashboard loads directly, no login screen.

### Step 4: Deploy to the internet with Netlify (5 minutes)

#### Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Coaching x Milestone"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/coaching-x-milestone.git
git push -u origin main
```
(If you don't have a GitHub account yet, make one free at [github.com](https://github.com) first — Netlify needs somewhere to pull the code from so it can rebuild the app whenever you make changes.)

#### Deploy on Netlify:
1. Go to [app.netlify.com](https://app.netlify.com) and log in to your existing account
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**, authorize Netlify if asked, and select the `coaching-x-milestone` repo
4. Build settings: **Build command** `npm run build`, **Publish directory** `dist` (Netlify usually detects these automatically for a Vite project)
5. Before deploying, open **Environment variables** and add everything from your `.env` file — the API token and all seven board IDs. This step matters: without them the build has no way to reach Monday.com
6. Click **Deploy site** — you'll get a live URL like `coaching-x-milestone.netlify.app`

Any time you (or I) change the code and push to GitHub, Netlify automatically rebuilds and redeploys — no manual re-upload needed.

#### Custom domain (optional):
Add it under Netlify → your site → **Domain settings** → **Add a domain**, then point the DNS record your registrar gives you. SSL is automatic.

---

## 🖇️ Embedding it in your Wix internal hub

Wix can't run this app directly (it's a custom React app with a build step, which isn't something Wix hosts natively) — but once it's live on Netlify, you can embed that page inside a Wix page so it appears inline on your internal hub:

1. In the Wix Editor, open the page on your internal hub where you want it to appear
2. Add an **Embed Code** element: **Add Elements** → **Embed & Social** → **Custom Embeds** → **Embed HTML**
3. Paste this, swapping in your real Netlify URL:
   ```html
   <iframe src="https://YOUR-SITE-NAME.netlify.app" style="width:100%; height:900px; border:none;"></iframe>
   ```
4. Resize the embed element on the page to give it room (the `height` above is a starting point — adjust to taste)
5. Publish the Wix page

One thing worth knowing: the iframe just displays the Netlify page — it doesn't add any extra login or access restriction on top of it. Anyone with the raw Netlify URL could open the app directly, not just people who reach it through Wix. Since only you use this app today, that's a minor concern, but keep it in mind if this ever needs tighter access control.

---

## 📋 Where your data lives

Everything is stored in Monday.com, in a workspace called **Coaching x Milestone**:

| Board | Holds |
|---|---|
| Loan Officers | Name, email, phone, team |
| Coaching Tasks | One-time assignments — description, category, priority, due date, linked resource, assigned officers |
| Task Completions | One item per officer who completes a coaching task (presence = done) |
| Daily Tasks | Recurring/one-off daily check-in definitions and who they're assigned to |
| Daily Check-ins | One item per officer completing a daily task on a given date |
| Coaching Resources | Training materials (PDFs, videos, docs) linked to tasks |
| Coaching Messages | Announcements and DMs |

Because it's just Monday boards, you can also view, filter, and edit this data directly in Monday if you ever want to — the app and the boards stay in sync since they're the same data.

---

## 👥 Adding Loan Officers

Use the **Add Officer** button on the Loan Officers page in the app — it creates the item directly in the Loan Officers board. You can also add them straight from Monday if you prefer.

---

## 📁 Project Structure

```
coaching-x-milestone/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite build config
├── .env.example            # Environment template (Monday token + board IDs)
├── public/
│   └── favicon.svg         # Milestone branded icon
└── src/
    ├── main.jsx             # React entry
    ├── index.css            # Global styles
    ├── App.jsx              # Renders the platform directly (no login)
    ├── CoachingPlatform.jsx # Full UI (dashboard, officers, tasks, etc.)
    └── mondayClient.js      # All Monday.com API calls (reads + writes)
```

`Login.jsx`, `Platform.jsx`, and `supabaseClient.js` are left in the repo but are no longer used by anything — they're leftovers from the earlier Supabase-based version. Safe to ignore, or ask to have them removed.

---

## 💰 Cost

| Service | Cost |
|---|---|
| Monday.com | Whatever your existing Pro plan already costs — no extra charge for this data |
| Netlify | Free tier (100GB bandwidth) covers this easily |
| Wix | Whatever you already pay — embedding is just a page element, no extra cost |

---

Built for Milestone Mortgage Solutions · NMLS #1815656
