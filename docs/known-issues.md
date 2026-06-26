
# Known Issues & Engineering Log

This document tracks engineering issues in chronological order.

Purpose:

* maintain debugging history
* record architectural mistakes
* document partial fixes
* preserve investigation context
* improve future debugging speed

---

# Engineering Log Timeline

---

# [2026-04-29] Auth Verification Email Delay

## Issue ID

```text
AUTH-001
```

## Description

Users created accounts successfully but did not immediately receive verification emails.

Some users attempted login before verification and received:

```text
Invalid login credentials
```

## Symptoms

* verification email missing
* login rejection after signup
* inconsistent onboarding experience

## Root Cause (Suspected)

Possible causes identified:

* Supabase verification email delay
* spam filtering
* SMTP queue delay
* premature login attempts before verification

## Systems Involved

* Supabase Auth
* Email Verification
* Frontend Login Flow

## Status

```text
MONITORING
```

## Notes

Potential future improvement:

* add explicit “check your email” waiting screen
* add resend verification button
* improve auth feedback messaging

---

---

# [2026-05-03] Route Redirect Flicker

## Issue ID

```text
ROUTING-001
```

## Description

Protected dashboard routes briefly rendered before redirecting users.

Example:

* dashboard flashes
* redirects after auth resolves

## Symptoms

* visible UI flicker
* unstable navigation feel
* inconsistent protected-route rendering

## Root Cause

Auth state resolved after initial render cycle.

Frontend rendered before role verification completed.

## Systems Involved

* TanStack Router
* Supabase Auth
* Route Guards
* Client Hydration

## Status

```text
PARTIALLY FIXED
```

## Mitigation Attempted

* loading state wrappers
* conditional dashboard rendering
* delayed redirect execution

## Remaining Concerns

* SSR hydration mismatch
* async role resolution timing

---

---

# [2026-05-03] Infinite Loading in Teacher/Admin Tabs

## Issue ID

```text
AUTH-002
```

## Description

Teacher/admin dashboard tabs entered infinite loading state during navigation and role resolution.

## Symptoms

* endless spinner/loading UI
* dashboard never rendering
* repeated redirects
* browser appearing frozen

## Root Cause

UI role-selection logic incorrectly coupled with redirect/auth flow.

This caused:

* repeated auth checks
* redirect loops
* unresolved async state
* stale loading states
* recursive route evaluation

## Systems Involved

* Auth Provider
* Dashboard Layout
* Role Redirect Logic
* TanStack Router
* Supabase Session Listener

## Status

```text
PARTIALLY FIXED
```

Further testing ongoing.

## Fix Attempts

### Attempt 1

Separated role fetch logic from UI render logic.

Result:

```text
PARTIAL IMPROVEMENT
```

### Attempt 2

Added conditional loading boundaries.

Result:

```text
REDUCED LOOP FREQUENCY
```

### Attempt 3

Refactored dashboard route handling.

Result:

```text
STILL UNDER TESTING
```

## Areas Still Under Investigation

* hydration timing
* SSR/client mismatch
* duplicate auth listeners
* async redirect sequencing
* race conditions during session restore

## Engineering Notes

This issue exposed architectural coupling between:

* auth state
* redirect state
* UI rendering
* role resolution

Future architecture should isolate these systems.

---

---

# [2026-05-04] Netlify SSR Deployment Failure

## Issue ID

```text
DEPLOY-001
```

## Description

Netlify deployment failed after SSR/TanStack integration attempts.

## Symptoms

* deployment build failure
* broken routing
* SSR incompatibilities
* runtime instability

## Root Cause

Mismatch between:

* SSR adapter behavior
* TanStack routing expectations
* Netlify runtime handling

## Systems Involved

* Netlify
* TanStack Start
* SSR Build System

## Resolution

Migration toward Cloudflare Workers deployment.

## Status

```text
RESOLVED
```

## Engineering Impact

This decision standardized deployment architecture around Cloudflare Workers.

---

---

# [2026-05-04] Environment Variable Configuration Drift

## Issue ID

```text
ENV-001
```

## Description

Deployment environments behaved inconsistently because environment variables differed across setups.

## Symptoms

* auth failures
* missing Supabase configuration
* deployment inconsistencies
* runtime crashes

## Root Cause

Inconsistent handling of:

```text
.env
.dev.vars
wrangler configuration
```

## Systems Involved

* Wrangler
* Cloudflare
* Supabase
* Local Development Environment

## Status

```text
PARTIALLY STABILIZED
```

## Mitigation

* standardized .env handling
* cleaner deployment process
* Cloudflare-focused workflow

## Future Improvements

* CI/CD secrets management
* environment validation checks
* startup config validation

---

---

# [2026-05-05] Dashboard State Persistence Problems

## Issue ID

```text
UI-001
```

## Description

Dashboard state occasionally reset after route changes or reloads.

## Symptoms

* layout reset
* navigation collapse reset
* temporary UI inconsistencies

## Root Cause

Component remounting and state coupling.

## Systems Involved

* React State
* Dashboard Layout
* Route Lifecycle

## Status

```text
PENDING REFACTOR
```

## Future Direction

Potential solutions:

* centralized layout store
* persistent UI state
* context isolation
* route-level state preservation

---

---

# Global Engineering Observations

## Primary Instability Sources

Most platform instability currently originates from:

```text
- auth timing
- redirect sequencing
- SSR hydration behavior
- async role resolution
- deployment configuration drift
```

---

# Recommended Stabilization Strategy

## Priority Order

```text
1. Centralize auth provider
2. Separate redirect logic from rendering
3. Introduce route middleware
4. Add timeout protection
5. Add structured auth logs
6. Add route-level error boundaries
7. Introduce hydration-safe loading guards
```

---

# Current Platform Stability Snapshot

```text
Frontend UI           → Mostly Stable
Authentication        → Needs Stabilization
Routing               → Medium Stability
Deployment            → Stable on Cloudflare
Role Management       → Needs Refinement
Database Integration  → Stable
SSR Hydration         → Needs Further Testing
```

---
