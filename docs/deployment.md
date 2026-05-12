# Deployment Documentation

## Current Deployment Stack

* Cloudflare Workers
* Wrangler CLI
* GitHub repository
* GoDaddy domain

---

# Deployment Architecture

```
GitHub Repository
        ↓
Build Process
        ↓
TanStack Output
        ↓
Wrangler Deploy
        ↓
Cloudflare Workers
        ↓
Custom Domain
```

---

# Deployment Process

## Local Build

```
npm run build
```

Build output:

```
/dist
```

---

## Worker Deployment

```
npx wrangler deploy
```

---

# Current Worker URL

```
*.workers.dev
```

Used before connecting custom domain.

---

# Domain Integration

## Flow

```
GoDaddy Domain
       ↓
Cloudflare Nameservers
       ↓
Cloudflare DNS
       ↓
Workers Custom Domain
```

---

# Deployment Issues Encountered

## Historical Issues

### 1. SSR Build Errors

Cause:

* routing mismatch
* environment variable issues
* worker configuration mismatch

---

### 2. Netlify Deployment Problems

Cause:

* TanStack SSR incompatibilities
* adapter mismatch
* routing behavior differences

Resolution:

* migrated toward Cloudflare Workers

---

### 3. Environment Variable Problems

Issues:

* missing Supabase keys
* inconsistent .env handling

---

# Required Files

```
wrangler.json
.env
.dev.vars
package.json
```

---

# Deployment Checklist

## Before Deploying

* run build locally
* verify environment variables
* test authentication
* test protected routes
* verify redirects
* verify dashboard rendering

---

# Future Deployment Goals

* CI/CD automation
* GitHub Actions pipeline
* preview deployments
* production/staging separation
* automated rollback system

---
