# Authentication & Authorization Documentation

## Authentication Stack

Brainexa uses Supabase Authentication.

Authentication methods:

* Email/password login
* Session persistence
* Protected routes
* Role-based access

---

# Authentication Architecture

```
User Login
    ↓
Supabase Auth
    ↓
Session Created
    ↓
Fetch Profile
    ↓
Resolve Role
    ↓
Redirect to Dashboard
```

---

# Auth Flow

## Registration Flow

```
User submits registration
        ↓
Supabase creates auth user
        ↓
Verification email sent
        ↓
User verifies email
        ↓
Profile record created
        ↓
Role assigned
```

---

## Login Flow

```
User login
      ↓
Supabase validates credentials
      ↓
Session returned
      ↓
Frontend auth listener updates
      ↓
Role fetched from database
      ↓
Dashboard redirect executed
```

---

# Role Flow

## Student

```
/student
```

Access:

* courses
* tests
* PDFs
* progress

---

## Teacher

```
/teacher
```

Access:

* assigned subjects
* student management
* quiz review
* course uploads

---

## Admin

```
/admin
```

Access:

* full management access
* teacher assignment
* referrals
* withdrawals
* analytics

---

# Redirect Logic

## Current Redirect Sequence

```
Auth detected
      ↓
Loading state enabled
      ↓
Profile query executed
      ↓
Role resolved
      ↓
Route pushed
      ↓
Loading state cleared
```

---

# Password Reset Flow

```
Forgot Password
       ↓
Supabase sends reset email
       ↓
User clicks reset link
       ↓
Password update screen
       ↓
New password stored
       ↓
Session refreshed
```

---

# Supabase Integration

## Main Usage Areas

### Authentication

* signInWithPassword
* signUp
* signOut
* resetPasswordForEmail

---

### Database Access

Tables:

* profiles
* teachers
* courses
* referrals
* withdrawals

---

### Session Management

Auth listener:

```
onAuthStateChange()
```

Used for:

* redirect handling
* session restoration
* logout handling
* route protection

---

# Current Auth Risks

## Known Weak Areas

* redirect race conditions
* profile fetch timing issues
* loading state deadlocks
* route hydration inconsistencies

---

# Recommended Future Improvements

* centralized auth provider
* middleware-based route guards
* role caching
* optimistic auth loading
* improved error boundaries

---
