# 🔮 Mystic 8-Ball

An interactive **3D Magic 8-Ball web application** built with **React, TypeScript, Vite, and Tailwind CSS**, focused on animation orchestration, accessibility, and polished user experience.


---

## ✨ Features

### 🎱 Core Experience

* Click-to-shake **3D Magic 8-Ball** with realistic depth and lighting
* Animated hands that shake the ball (disabled in reduced-motion mode)
* Smooth reveal animations with category-based styling

### 🧠 Quote Categories

* **Motivational ⚡** — short, uplifting encouragement
* **Word Wisdom 📖** — word-of-the-day style insights
* **Poetic 💫** — metaphorical, expressive messages
* Random or user-selected category support

### 🧩 User Interaction

* Optional **user question input** for personal engagement
* Display of the user’s question beneath the revealed answer
* Automatic input reset after each interaction

---

## 📜 Wisdom History (Persistence)

* Saves the last **20 results** using `localStorage`
* Each entry includes:
* Slide-up **History modal**
* Filter history by category

---

## ⏳ Daily Usage Limit

* Limited to **3 shakes per session window**
* Usage tracked via `localStorage`
* Friendly cooldown message when the limit is reached
* Automatic reset after the cooldown period

This adds a sense of ritual and intentionality to the experience.

---

## 🎨 Theme / Mood System

Switch between fully styled themes:

* **Cosmic 🌌** — vibrant gradients and glowing accents
* **Dark Oracle 🔮** — moody, high-contrast mysticism
* **Minimal Zen 🧘** — calm, neutral, reduced visual noise

Themes control:

* Background gradients
* 8-ball materials and lighting
* Accent colors and UI tone

User preference is persisted across sessions.

---

## ♿ Accessibility

* Detects `prefers-reduced-motion`
* Automatically disables:

  * Shake animations
  * Animated hands
* Replaces motion with subtle fade/scale transitions

This ensures the app remains usable and comfortable for motion-sensitive users.

---

## 🛠 Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **lucide-react** (icons)
* **localStorage** (persistence)

No external animation libraries were used — all motion is handled manually for full control.

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🧠 Design & Engineering Focus

This project intentionally emphasizes:

* Animation sequencing and state timing
* Accessibility-first motion design
* Persistent UI state
* Product-oriented UX decisions
* Clean component structure

It was built to demonstrate **real-world frontend thinking**, not just visual flair.

---

## 📌 Future Enhancements

* Shareable quote cards
* Sound effects with mute toggle
* Daily streak tracking
* Server-side quote rotation

---

## 👤 Author

**Diego Hills**
Frontend / Full-Stack Developer