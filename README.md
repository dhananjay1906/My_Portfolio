# DJ Desai: Portfolio

My personal portfolio site: **[my-portfolio-dj-f260.vercel.app](https://my-portfolio-dj-f260.vercel.app)**

## What's in it

- 3D hero built with **Three.js** (a particle network and a rotating icosahedron) with scroll-driven parallax
- **GSAP** animations, a typewriter intro and scroll reveals
- Project cards with a 3D tilt on hover
- **"Chat with my resume"**: a chat widget that answers recruiters' questions about my experience, backed by a serverless function (`api/chat.js`)
- Fully responsive, with a lighter 3D scene on mobile

## Tech

HTML, CSS, vanilla JavaScript, Three.js, GSAP, and Vercel serverless functions (Node.js).

## Run locally

```bash
npm install
npm i -g vercel
vercel dev            # serves the site and /api/chat on http://localhost:3000
```

The chat endpoint needs an `ANTHROPIC_API_KEY` environment variable (in `.env.local`, or in the Vercel project settings).

## Structure

```
index.html            page markup
assets/css/style.css  styles and responsive breakpoints
assets/js/main.js     Three.js scene, animations, chat widget
api/chat.js           serverless chat endpoint
vercel.json           routing
```
