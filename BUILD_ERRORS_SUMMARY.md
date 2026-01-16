# Build Errors Summary & Prevention Guide

## Errors Encountered During Build

### 1. TypeScript Error: `verifyOtp` Parameter Requirements

**Error:**
```
Type error: Argument of type '{ token: string; type: "signup"; }' is not assignable to parameter of type 'VerifyOtpParams'.
Property 'email' is missing in type '{ token: string; type: "signup"; }' but required in type 'VerifyEmailOtpParams'.
```

**Root Cause:**
- When using `supabase.auth.verifyOtp()` with the `token` parameter (not `token_hash`), TypeScript requires an `email` parameter
- Email links use `token_hash`, not `token`
- Attempting to use `token` as a fallback without providing `email` causes the error

**Solution Applied:**
- Removed unnecessary fallback that tried to use `token` without `email`
- For email links, only use `token_hash` parameter
- If fallback is needed, ensure `email` is available and included

**Prevention:**
- ✅ Always use `token_hash` for email link verification
- ✅ If using `token` parameter, always include `email`
- ❌ Don't try to use `token` as a fallback without `email`

---

### 2. TypeScript Error: Invalid `resend` Type

**Error:**
```
Type error: Type '"recovery"' is not assignable to type '"signup" | MobileOtpType | "email_change"'.
```

**Root Cause:**
- The `supabase.auth.resend()` method does NOT support `'recovery'` as a type
- Only `'signup'`, mobile OTP types, and `'email_change'` are supported
- Password reset codes must be resent using `resetPasswordForEmail()` instead

**Solution Applied:**
- Changed from `supabase.auth.resend({ type: 'recovery', email })` 
- To `supabase.auth.resetPasswordForEmail(email)`

**Prevention:**
- ✅ Use `resetPasswordForEmail()` to resend password reset codes
- ✅ Use `resend()` only for signup, mobile OTP, or email change
- ❌ Never use `resend()` with `type: 'recovery'`

---

### 3. Next.js Error: Missing Suspense Boundary

**Error:**
```
useSearchParams() should be wrapped in a suspense boundary at page "/confirm"
```

**Root Cause:**
- Next.js 13+ requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary
- This is required for static generation and proper SSR behavior
- Without it, Next.js cannot pre-render the page

**Solution Applied:**
- Wrapped components using `useSearchParams()` in `<Suspense>` boundaries
- Created separate content components and wrapped them in default exports
- Added loading fallbacks

**Prevention:**
- ✅ Always wrap `useSearchParams()` usage in `<Suspense>` boundary
- ✅ Create a content component and wrap it in the default export
- ✅ Provide a loading fallback for better UX
- ❌ Never use `useSearchParams()` directly in a page component without Suspense

---

## Quick Reference Checklist

### When Working with Supabase Auth:

- [ ] Use `token_hash` for email link verification (not `token`)
- [ ] If using `token`, always include `email` parameter
- [ ] Use `resetPasswordForEmail()` for password reset (not `resend()`)
- [ ] Use `resend()` only for: signup, mobile OTP, or email change

### When Using Next.js Hooks:

- [ ] Wrap `useSearchParams()` in `<Suspense>` boundary
- [ ] Create separate content components for hooks that require Suspense
- [ ] Provide loading fallbacks for better UX

### General Best Practices:

- [ ] Run `npm run build` frequently during development
- [ ] Fix TypeScript errors immediately (don't accumulate them)
- [ ] Test both development and production builds
- [ ] Read error messages carefully - they often point to the exact issue

---

## Files Modified

1. `app/auth/callback/route.ts` - Removed invalid `token` fallback
2. `app/confirm/page.tsx` - Added Suspense boundary, fixed token verification
3. `app/reset-password/confirm/page.tsx` - Added Suspense boundary, fixed resend method
4. `app/forgot-password/page.tsx` - Updated button text and removed redirectTo

---

**Build Status:** ✅ Successfully passing
**Date:** Build completed successfully after fixes
