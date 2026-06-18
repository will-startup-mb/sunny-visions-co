# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

> **Note:** Node/npm are installed via Homebrew. If commands are not found, run `eval "$(/opt/homebrew/bin/brew shellenv)"` first, or open a new terminal.

## Stack

- **Next.js 16** (App Router) with **React 19** and **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **ESLint 9** with `eslint-config-next`

> This is Next.js 16, which has breaking changes from older versions. Before writing routing, data-fetching, or config code, check `node_modules/next/dist/docs/` for current conventions.

## Project Structure

```
src/
  app/              # App Router root — layouts and pages live here
    layout.tsx      # Root layout (HTML shell, fonts, global metadata)
    page.tsx        # Home route (/)
    globals.css     # Global styles + Tailwind base imports
public/             # Static assets served at /
next.config.ts      # Next.js config
tsconfig.json       # TypeScript config (path alias: @/* → src/*)
```

## Key Conventions

- All routes go under `src/app/` using the App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Server Components are the default; add `"use client"` only when browser APIs or interactivity require it.
- Tailwind utility classes are the primary styling mechanism — no CSS modules or styled-components.
- The `@/*` import alias maps to `src/*`.
