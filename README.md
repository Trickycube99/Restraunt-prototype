# Kaffa Studios — The Poetry of Extraction

> A minimalist, scrollytelling web experience exploring single-origin coffee extraction, tactile ceramics, and morning stillness.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTrickycube99%2FRestraunt-prototype)

---

## Overview

**Kaffa Studios** is an editorial culinary and coffee experience built with vanilla web technologies, centered around:
- **Hero Frame Sequencer**: 192-frame synchronized canvas scroll animation illustrating the architecture of coffee extraction and microfoam equilibrium.
- **Interactive Studies**: Real-time canvas simulations including Grind Particle Dynamics, Pour Extraction Fluid Dynamics, Ceramic Thermal Dissipation, and Flavor Wheel exploration.
- **Minimalist Aesthetic**: Monochromatic palette, anti-card typography, and curated fonts (*Playwrite CA* and *Caveat*).
- **Interactive Bag Drawer**: Slide-over cart experience with item addition, subtraction, subtotal computation, and state persistence.

---

## Project Structure

```text
rest/
├── assets/                  # Editorial imagery (beans, drippers, ceramics, etc.)
├── Caveat/                  # Caveat font files and documentation
├── frames/                  # 192 sequential high-res animation frames for canvas hero
├── index.html               # Main semantic HTML5 document
├── style.css                # Vanilla CSS styling with design tokens & responsive layout
├── app.js                   # Canvas animations, scrollytelling sequencer & cart logic
├── vercel.json              # Vercel deployment & cache optimization configuration
├── .gitignore               # Ignored files (archives, OS files, caches)
└── README.md                # Project documentation
```

---

## Deploying to Vercel

### Option 1: Automatic Deployment via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Import the repository: `Trickycube99/Restraunt-prototype`.
4. Framework Preset: Leave as **"Other"** (Static HTML/CSS/JS).
5. Root Directory: `./` (default).
6. Click **Deploy**. Vercel will deploy your website to a public URL within seconds.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy directly from this directory
vercel

# Deploy to production
vercel --prod
```

---

## Local Development

You can preview the site locally using any static file server:

### Using Python:
```bash
python -m http.server 3000
```

### Using Node / npx:
```bash
npx serve .
```

### Using VS Code:
Right-click `index.html` and select **"Open with Live Server"**.

Then open your browser at `http://localhost:3000`.

---

## Technologies Used

- **HTML5**: Semantic tags, ARIA accessibility attributes, clean document structure.
- **CSS3**: Custom design tokens, CSS Grid, Flexbox, responsive clamp typography, smooth transitions.
- **JavaScript (ES6+)**: Scroll-linked 2D Canvas rendering, image preloader buffer, reactive shopping drawer state.
- **Google Fonts**: Caveat & Playwrite CA.
- **Vercel**: Static edge deployment with immutable caching headers for media frames.
