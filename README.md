# Vibe Coden Website

A full-stack Next.js website for Vibe Coden — a 501(c)(3) nonprofit teaching teens to build real software with AI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([download here](https://nodejs.org))
- A code editor (VS Code recommended)

### Installation & Development

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open in browser:**
Navigate to `http://localhost:3000` and you'll see the full Vibe Coden website!

### Build for Production
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
vibe-coden/
├── app/
│   ├── layout.tsx           # Root layout with nav, footer, background
│   ├── page.tsx             # Home page
│   ├── context.tsx          # Global state (cart, voting)
│   ├── globals.css          # Global styles & animations
│   ├── vibe-a-thons/page.tsx # Arena page
│   ├── shop/page.tsx        # Shop page
│   └── dashboard/page.tsx   # Dashboard page
├── components/
│   ├── Navigation.tsx       # Top navigation with logo & links
│   ├── Footer.tsx           # Footer with links & buttons
│   ├── CountUpStat.tsx      # Animated number counter
│   ├── Countdown.tsx        # Live countdown timer
│   ├── TerminalWindow.tsx   # Terminal demo on Arena page
│   └── Leaderboard.tsx      # Voting leaderboard
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind design tokens
└── postcss.config.js        # PostCSS config
```

## 🎨 Features

### Pages
- **Home** — Landing page with impact stats, scholarship info, teasers
- **Vibe-a-thons** — Competition arena with live leaderboard and voting
- **Shop** — Merch store with cart management (100% profits → scholarships)
- **Dashboard** — Logged-in student view with level, XP, projects, badges

### Components
- Animated number counters (impact stats)
- Live countdown timers
- Terminal demo with typing effect
- Interactive leaderboard with voting
- Persistent cart with localStorage
- Responsive design (mobile, tablet, desktop)
- Animated background with floating orbs
- Design-accurate animations (floaty, pulse, marquee, etc.)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **Fonts:** Chakra Petch, JetBrains Mono, Space Grotesk (Google Fonts)
- **State:** React Context API for cart & voting
- **Storage:** localStorage for cart persistence

## 🎯 Design Tokens

All colors, typography, spacing, and animations are defined in `tailwind.config.ts` and `app/globals.css`. They match the design specification exactly:
- **Primary accent:** Orange (#FF8A21)
- **Secondary accent:** Violet (#8B5CF6)
- **Text:** Lavender (#E7DEF8) on dark backgrounds
- **Animations:** Floaty, pulse, blink, marquee, sheen

## 📦 State Management

### Cart (useAppContext)
- Add/remove items
- Persisted to localStorage
- Cart count shows in nav badge

### Voting (useAppContext)
- One vote per user per build
- Votes increment, re-sort leaderboard
- Button disables after voting (shows "✓ VOTED")

### User Identifier
- Generated on first visit, stored in localStorage
- Used for vote tracking

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vibe-coden.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your `vibe-coden` repo
   - Click "Deploy"

Your site is now live! 🎉

### Deploy on Other Platforms
- **Netlify:** Connect your GitHub repo at netlify.com
- **Self-hosted:** Build with `npm run build`, then deploy the `.next` folder to your server

## 📝 Next Steps

To make this production-ready, you'll need to add:

1. **Backend API** — Node.js/Express for real data
2. **Database** — Postgres with Prisma ORM
3. **Authentication** — NextAuth.js for student login
4. **Payments** — Stripe for shop checkout & donations
5. **Real data** — Replace mock data with actual API calls
6. **Images** — Replace placeholder striped backgrounds with real product photos

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**CSS not loading?**
Delete `.next` folder and restart:
```bash
rm -rf .next
npm run dev
```

**Node modules issue?**
Delete and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Vercel Deployment](https://vercel.com/docs)

## 💬 Questions?

Refer back to the original design spec and this README. All button clicks are wired up, all pages route correctly, and all animations work out of the box.

Happy building! 🚀
