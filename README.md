# Pokédex Explorer

เว็บแอปพลิเคชันสารานุกรมโปเกมอน (Pokédex) และ 7 มินิเกมสุดคลาสสิก พัฒนาด้วย Next.js App Router, React 19, TypeScript (Strict Mode) และ Tailwind CSS ขับเคลื่อนด้วยข้อมูลสดจาก [PokéAPI v2](https://pokeapi.co/)

[🇹🇭 สรุปภาพรวมภาษาไทย](#-สรุปภาพรวมภาษาไทย) | [English Documentation](#-english-documentation)

---

## 🇹🇭 สรุปภาพรวมภาษาไทย

### ⚡ ฟีเจอร์หลัก
* **Pokédex Explorer**: ค้นหาตามชื่อ/รหัสโปเกมอน ฟิลเตอร์ตามธาตุ (18 ธาตุ) และรุ่น (Gen 1–9) แบบ real-time
* **หน้ารายละเอียดโปเกมอน**: แสดงรูปอาร์ตเวิร์กทางการ, สลับดูร่าง Shiny, กราฟ Stat แสดงค่าพลัง, ความสามารถ, ส่วนสูง/น้ำหนัก และเปิดฟังเสียงร้อง (Cry)
* **ระบบเปรียบเทียบ (Compare)**: นำโปเกมอน 2 ตัวมาวางเทียบค่าพลังตัวต่อตัว ไฮไลท์จุดเด่นชัดเจน
* **ระบบ Favorites & จัดทีม (Team Builder)**: กดบุ๊กมาร์กตัวที่ชอบ และจัดทีมได้สูงสุด 6 ตัว พร้อมระบบวิเคราะห์จุดอ่อน/จุดต้านทานธาตุรวมอัตโนมัติ
* **ชื่อภาษาอังกฤษเวอร์ชันญี่ปุ่น**: แสดงชื่อ Romaji ญี่ปุ่นเป็นชื่อหลักทั่วทั้งแอป (*Lizardon*, *Kamex*, *Fushigidane*, *Hitokage*, *Purin*)
* **Dark Mode & รองรับ 2 ภาษา**: มีปุ่มสลับธีม Dark Mode และสลับภาษาไทย (TH) / อังกฤษ (EN) ได้ทันที
* **ความปลอดภัย & Ephemeral Privacy**: เก็บสถานะชั่วคราวใน Memory เท่านั้น ไม่บันทึกข้อมูลลง `localStorage`, Cookie หรือ Database ใดๆ

### 🎮 7 มินิเกม
1. **Who's That Pokémon?**: ทายชื่อโปเกมอนจากรูปภาพ 10 ข้อ ชอยส์ 4 ตัวเลือก
2. **Silhouette Challenge**: ทายชื่อโปเกมอนจากภาพเงามืด
3. **Higher or Lower**: ทายค่าสเตตัสตัวถัดไปว่าสูงกว่าหรือต่ำกว่า
4. **Pokémon Cry Quiz**: ฟังไฟล์เสียงร้องแล้วทายตัวโปเกมอน
5. **Type Match**: ตอบคำถามเรื่องชนะทาง/แพ้ทางตามตารางธาตุ
6. **Memory Card Game**: เกมเปิดการ์ดจับคู่ นับเวลาและจำนวนครั้งที่เปิด
7. **Battle Simulator**: จำลองการต่อสู้แบบ Turn-based สู้กับบอท AI (Quick Attack / Power Attack / Defend)

### 🛠️ Tech Stack
* **Framework & Core**: Next.js 16 (App Router, Turbopack), React 19, TypeScript (Strict Mode)
* **Styling**: Tailwind CSS v4, Lucide React
* **Data Fetching**: PokéAPI v2, TanStack Query
* **Testing**: Vitest, React Testing Library, Playwright E2E

### 🚀 วิธีติดตั้งและรันโปรเจกต์
```bash
git clone https://github.com/equalignorecase/poke-explorer.git
cd poke-explorer
npm install
npm run dev        # เปิดใช้งานที่ http://localhost:3000
npm test           # รัน unit/integration tests
npm run build      # บิลด์ production
```

---

## 🌐 English Documentation

An unofficial, modern, production-grade web application combining an encyclopedic Pokédex with seven interactive Pokémon mini-games. Powered by the public [PokéAPI v2](https://pokeapi.co/), built with Next.js App Router, React 19, TypeScript (strict mode), and Tailwind CSS.

---

## ⚡ Highlights

- **Complete Pokédex Explorer:** Real-time search by name or Pokédex number, filtering by Pokémon type (all 18 types) and generation (Generations I–IX) using exact API intersection logic.
- **Detailed Pokémon Profiles:** Official artwork, shiny variant toggle, base stats with proportional visual gauges, physical dimensions, abilities, flavor text, and audio cries.
- **Side-by-Side Comparison:** Compare any two Pokémon across all base stats with real-time stat advantage highlighting.
- **Temporary Favorites & Team Builder:** Bookmark favorites and assemble a 6-member squad with automated combined type defense & vulnerability analysis.
- **7 Fully Playable Mini-Games:**
  1. **Who's That Pokémon?** — Fast-paced 10-round multiple-choice visual quiz.
  2. **Silhouette Challenge** — Pure silhouette shape recognition without revealing spoilers.
  3. **Higher or Lower** — Guess whether the next Pokémon's base stat is higher or lower with strictly enforced tie-breakers.
  4. **Pokémon Cry Quiz** — Listen to official sound cries and identify the Pokémon.
  5. **Type Match** — Test your mastery of single and dual-type elemental multipliers.
  6. **Memory Card Game** — Interactive card flipping with move counts and timer.
  7. **Battle Simulator** — Turn-based tactical combat simulator featuring Quick Attack, Power Attack, and Defend mechanics against an AI opponent.
- **Internationalization (i18n):** Instant runtime bilingual interface switching between **English (en)** and **Thai (th)** with no page reload required.
- **Strict Ephemeral Privacy:** 100% session-based state; zero cookies, localStorage, IndexedDB, or tracking databases used.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Library:** React 19
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (Modern Minimal design tokens)
- **Icons:** Lucide React
- **Data & Caching:** PokéAPI v2 via native Fetch and TanStack Query
- **Testing:** Vitest, React Testing Library, Playwright
- **Animations:** Motion, Canvas-confetti

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── layout.tsx              # Root layout with providers, fonts, Navbar & Footer
│   ├── page.tsx                # Homepage (Hero, Featured, Explore by Type, Games, Spotlight)
│   ├── pokedex/page.tsx        # Pokédex Explorer with search, filters & pagination
│   ├── pokemon/[id]/page.tsx   # Detailed Pokémon profile, shiny toggle, cry player
│   ├── compare/page.tsx        # Side-by-side stat comparison engine
│   ├── favorites/page.tsx      # Temporary session favorites
│   ├── team/page.tsx           # 6-member team builder & weakness analysis
│   ├── games/
│   │   ├── page.tsx            # Mini-games hub
│   │   ├── guess/page.tsx      # Game 1: Who's That Pokémon?
│   │   ├── silhouette/page.tsx # Game 2: Silhouette Challenge
│   │   ├── higher-lower/page.tsx# Game 3: Higher or Lower
│   │   ├── cry/page.tsx        # Game 4: Pokémon Cry Quiz
│   │   ├── type-match/page.tsx # Game 5: Type Match
│   │   ├── memory/page.tsx     # Game 6: Memory Card Game
│   │   └── battle/page.tsx     # Game 7: Battle Simulator
│   ├── about/page.tsx          # Project details, credits, legal disclaimer
│   ├── api/
│   │   └── pokemon/            # Route handlers with caching headers
│   ├── globals.css             # Theme variables & modern minimal tokens
│   ├── loading.tsx             # Global loading state
│   ├── error.tsx               # Global error boundary
│   └── not-found.tsx           # 404 handler
├── components/
│   ├── layout/                 # Navbar, Footer, LanguageSwitcher
│   ├── pokemon/                # PokemonCard, PokemonArtwork, TypeBadge, StatBar, Search, Filters
│   └── games/                  # GameHeader, GameScore, GameResult, AnswerButton
├── context/
│   ├── LanguageContext.tsx     # Temporary bilingual i18n context
│   ├── FavoritesContext.tsx    # Temporary favorites session state
│   └── TeamContext.tsx         # 6-slot squad builder session state
├── i18n/                       # Typed dictionaries (en.ts, th.ts, types.ts)
├── lib/
│   ├── pokeapi/                # Centralized PokéAPI client & helpers
│   ├── games/                  # Battle engine, type chart, quiz generation utilities
│   └── utils.ts                # Formatting and styling helpers
└── tests/
    ├── unit/                   # Vitest unit tests (engine, battle, types)
    ├── integration/            # React Testing Library integration tests
    └── e2e/                    # Playwright end-to-end user journeys
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+ (tested on Node v26)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pokedex-explorer.git
cd pokedex-explorer

# Install dependencies
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing & Verification

Run the automated test suites:

```bash
# Run unit & integration tests with Vitest
npm test

# Type checking
npm run typecheck

# Code quality & ESLint checks
npm run lint

# Production build test
npm run build
```

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository (`pokedex-explorer`).
4. Keep the default build settings:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click **Deploy**. No environment variables or external API keys are required.

---

## ⚠️ Known Limitations

- **Temporary Session Storage:** By design, all bookmarked favorites, teams, and game high scores reside in runtime React Context and reset upon browser page reload.
- **Simplified Battle Simulator:** The battle simulator is an educational game using derived base stats, action priority, and elemental multiplier interactions. It does not reproduce official competitive tournament rules (EVs/IVs, items, abilities, weather, or entry hazards).
- **PokéAPI Public Service:** Image artwork and sound cries rely on PokéAPI's public endpoints; offline use requires previously cached network assets.

---

## 📜 Disclaimer & Credits

**Pokédex Explorer** is an unofficial fan-made educational project. It is **not** affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.

Pokémon and all related names and imagery are registered trademarks of their respective owners. Data and assets provided courtesy of [PokéAPI v2](https://pokeapi.co/).

---

## 📄 License

This software is licensed under the [MIT License](LICENSE).
