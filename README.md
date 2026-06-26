# Brainexa App

AI-Powered EdTech Platform built with TanStack Start, Supabase, and Cloudflare Workers.

---

## Overview

Brainexa is a scalable role-based educational platform designed for:

* students
* teachers
* administrators

The platform combines:

* structured course delivery
* dashboard systems
* authentication architecture
* AI-assisted learning workflows
* future monetization systems

The project is being engineered with production scalability in mind.

---

## Tech Stack

### Frontend

* React
* TypeScript
* TanStack Start
* TanStack Router
* TailwindCSS
* shadcn/ui

---

### Backend

* Supabase Auth
* Supabase PostgreSQL
* Supabase APIs

---

### Deployment Stack

* Cloudflare Workers
* Wrangler CLI
* GoDaddy Domain Integration

---

## Core Features

### Authentication

* Email/password login
* Role-based access
* Protected routes
* Session persistence

---

### Dashboards

#### Student Dashboard

Features:

* course access
* lesson navigation
* tests
* PDFs
* progress tracking

---

#### Teacher Dashboard

Features:

* assigned subjects
* content management
* quiz moderation
* student handling

---

#### Admin Dashboard

Features:

* platform management
* teacher assignment
* referrals
* withdrawals
* analytics

---

## Planned AI Features

* AI tutor assistant
* AI-generated quizzes
* AI doubt solving
* AI explanation system
* AI moderation tools

---

## Project Structure

```text
src/
├── components/
├── routes/
├── hooks/
├── integrations/
├── lib/
└── styles/

docs/
├── architecture.md
├── roadmap.md
├── auth.md
├── deployment.md
└── known-issues.md
```

---

## Local Development

### Install Dependencies

```bash
npm install
```

---

### Run Development Server

```bash
npm run dev
```

---

### Build Project

```bash
npm run build
```

---

## Environment Variables

Required variables:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Additional deployment variables may exist for Cloudflare Workers.

---

## Deployment

### Cloudflare Workers Deployment

```bash
npx wrangler deploy
```

---

## Deployment Flow

```text
GitHub
   ↓
Build
   ↓
Wrangler
   ↓
Cloudflare Workers
   ↓
Custom Domain
```

---

## Current Engineering Focus

Main stabilization priorities:

* authentication flow
* redirect stability
* SSR hydration consistency
* dashboard loading states
* deployment consistency

---

## Documentation

Detailed engineering docs:

* `/docs/architecture.md`
* `/docs/roadmap.md`
* `/docs/auth.md`
* `/docs/deployment.md`
* `/docs/known-issues.md`

---

## Current Project Status

```text
Frontend UI           → Mostly Stable
Authentication        → Needs Stabilization
Routing               → Medium Stability
Deployment            → Stable on Cloudflare
Role Management       → Needs Refinement
Database Integration  → Stable
SSR Hydration         → Under Investigation
```

---

## Engineering Philosophy

Brainexa is being built with focus on:

* modular architecture
* scalable deployment
* production-grade systems
* AI-native workflows
* long-term maintainability

---

## Future Vision

Brainexa aims to evolve into a complete AI-powered education ecosystem featuring:

* intelligent tutoring
* automated assessments
* scalable teacher tools
* analytics-driven learning
* monetized educational infrastructure

---

## Maintainer

```text
Ayush Gupta | AR Engineering
```
