# QuillStudio website

Vite, React, TypeScript, Tailwind (shadcn layout), framer-motion, GSAP, @paper-design/shaders.

## Run
npm install
npm run dev            # local development
npm run build          # production build in dist/
npm run build:single   # one self-contained preview file in dist-single/index.html

## Before launch
Fill in src/config/site.ts: AppExchange listing URL, demo booking link, contact email,
form endpoint, privacy, terms and cookies links.
Add the official white-background logos:
  public/brand/quillstudio-logo.png
  public/brand/exceller-tech-logo.png
Until they exist, a plain text wordmark is shown.

## Where things live
src/components/ui        liquid-metal-button, gradient-card, animated-gradient, magnetic-cursor, reveal
src/components/layout    Navbar, SmudgeLayer, SceneStack, Logo
src/components/sections  Hero, Problem, Demo, Capabilities, Governance, Proof, Cta, Footer
The 3D slot is the HeroObjectSlot component in Hero.tsx (data-slot="hero-3d").
