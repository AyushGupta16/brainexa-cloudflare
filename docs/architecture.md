# Brainexa Architecture

## Overview

Brainexa is a role-based edtech platform built using:

* Frontend: TanStack Start + React + TypeScript
* Backend: Supabase
* Deployment: Cloudflare Workers
* Styling: TailwindCSS + shadcn/ui
* Authentication: Supabase Auth
* Database: PostgreSQL (Supabase)

The system is designed around:

* Multi-role authentication
* Dynamic dashboard rendering
* Course/content hierarchy
* AI-powered educational tooling
* Scalable edge deployment

---

# High-Level System Architecture

```
┌────────────────────┐
│      Browser       │
│  React Frontend    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ TanStack Start App │
│ Routing + SSR/SPA  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Supabase Client  │
│ Auth + Database    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│   Supabase Cloud   │
│ PostgreSQL + Auth  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Cloudflare Workers │
│ Global Deployment  │
└────────────────────┘
```

---

# Application Layer Architecture

```
src/
├── components/
│   ├── brainexa/
│   ├── ui/
│   └── shared/
│
├── routes/
│   ├── admin/
│   ├── teacher/
│   ├── student/
│   └── auth/
│
├── integrations/
│   └── supabase/
│
├── hooks/
├── lib/
└── styles/
```

---

# Core Architectural Principles

## 1. Role-Based Routing

The entire platform behavior changes based on:

* student
* teacher
* admin

Role information is fetched from Supabase after authentication.

---

## 2. Centralized Auth State

Authentication state is maintained globally.

Main responsibilities:

* session tracking
* redirect handling
* protected routes
* role resolution
* loading state handling

---

## 3. Edge Deployment Strategy

Cloudflare Workers are used for:

* low-latency global delivery
* scalable SSR handling
* custom domain deployment
* lightweight infrastructure

---

## 4. Modular UI System

UI components are shared across:

* dashboards
* forms
* content viewers
* admin panels

This reduces duplication and improves consistency.

---

# Database Architecture

```
profiles
├── id
├── role
├── full_name
└── created_at

courses
├── id
├── title
├── subject
└── created_by

topics
├── id
├── course_id
├── title
└── order_index

lessons
├── id
├── topic_id
├── video_url
├── pdf_url
└── test_id
```

---

# Future Architecture Expansion

Planned systems:

* AI quiz generation
* AI doubt solving
* Referral engine
* Analytics dashboard
* Teacher moderation tools
* Course marketplace
* Real-time classroom systems

---
