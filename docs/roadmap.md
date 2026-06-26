# Brainexa Product & Engineering Roadmap

## Phase 1 — Foundation

### Status: Completed

Features completed:

* Initial UI
* Landing page
* Basic routing
* TanStack integration
* Supabase setup
* Authentication setup
* Cloudflare deployment
* Role dashboards

---

## Phase 2 — Core Platform

### Status: In Progress

Current focus:

* Role-based dashboard refinement
* Redirect stabilization
* Admin panel improvements
* Teacher assignment system
* Database cleanup
* Route protection

Tasks:

* Fix auth race conditions
* Improve loading states
* Refactor dashboard navigation
* Optimize SSR behavior

---

## Phase 3 — Course System

### Planned

Features:

* Subject hierarchy
* Topic sequencing
* Video lessons
* PDF attachments
* Quiz engine
* AI quiz generation

Content flow:

```
Subject
   ↓
Course
   ↓
Lesson
   ↓
Topic
   ↓
Video/PDF/Test
```

---

## Phase 4 — AI Layer

### Planned

Features:

* AI tutor assistant
* AI explanation system
* AI-generated quizzes
* Teacher AI moderation
* Smart recommendation engine

---

## Phase 5 — Monetization

### Planned

Features:

* Referral earnings
* Withdrawals
* Affiliate tracking
* Subscription plans
* Premium courses

---

## Phase 6 — Scale & Production

### Planned

Features:

* Performance optimization
* CDN asset optimization
* Monitoring systems
* Logging infrastructure
* Advanced analytics
* Security hardening

---

# Engineering Priorities

## Current Highest Priority

1. Stabilize authentication flow
2. Fix redirect loops
3. Remove infinite loading issues
4. Improve deployment consistency
5. Clean component architecture

---

# Suggested GitHub Workflow

```
main
 ├── production-ready code
 │
develop
 ├── integration branch
 │
feature/*
 ├── isolated feature work
 │
bugs/*
 └── hotfixes and debugging
```

---
