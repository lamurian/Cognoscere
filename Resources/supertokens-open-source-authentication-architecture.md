---
title: 'SuperTokens: Open-Source Authentication Architecture'
description: How SuperTokens works — three-tier architecture, rotating refresh tokens with theft detection, session management, and deployment modes.
author: pi
editor: lam
date: 2026-06-04T11:24:40.084Z
tags:
  - authentication
  - open-source
  - security
  - software
  - self-hosting
---

SuperTokens is an open-source authentication framework (Apache 2.0 core, MIT SDKs) that replaces managed services like Auth0, Firebase Auth, and AWS Cognito. Its key differentiator is a "backend-in-the-middle" architecture that keeps user data on your infrastructure while offloading cryptographic heavy lifting.

## Three-Tier Architecture

SuperTokens separates concerns into three components that communicate over HTTP:

1. **Frontend SDK** (JavaScript/TypeScript, React, Angular, Vue, React Native, Flutter, iOS, Android) — manages session token storage, renders login UI widgets, and handles automatic token refresh. It communicates only with the Application Backend, never directly with SuperTokens Core.

2. **Backend SDK** (Node.js, Python, Go) — orchestrates auth flows, exposes API endpoints, and verifies sessions locally without contacting Core. This local verification is the key to horizontal scalability: a single Core instance can support tens of thousands of users because most requests never reach it.

3. **SuperTokens Core** (Java with embedded Tomcat) — handles authentication business logic: password hashing (bcrypt), JWT signing, session persistence, and database operations. Runs as a lightweight HTTP service backed exclusively by PostgreSQL v13+ (MySQL and MongoDB support was dropped in v11.0.0).

The architecture enables network isolation: Core and Database can live in a private subnet with only the Application Backend needing network access to them.

## Rotating Refresh Tokens with Theft Detection

SuperTokens's most distinctive security feature is its session token system, which goes beyond standard stateless JWT approaches.

**Dual-token system:**
- **AccessToken** — short-lived JWT (few minutes), stored in memory or httpOnly cookie, verified locally by the Backend SDK using cached signing keys.
- **RefreshToken** — long-lived opaque token (days/weeks), stored in httpOnly cookie, verified by Core.
- **Anti-CSRF token** — stored in localStorage, verified by Backend SDK alongside AccessToken.

**Rotating refresh tokens with fork detection:**
Every refresh operation issues a new RefreshToken and invalidates the old one. If an attacker steals RefreshToken_R1 and uses it, the system issues a new token pair. When the legitimate user later tries to use the now-stale R1, the Core detects a "fork" in the token lineage and revokes the entire session family. This limits the theft window from "indefinite" to "until the legitimate user's next refresh."

## Authentication Methods (Recipes)

SuperTokens uses a modular "recipe" system. Each recipe is a self-contained authentication feature:

| Recipe | Purpose |
|---|---|
| Session | Foundation — access/refresh token management |
| EmailPassword | Email + password sign-up/sign-in |
| Passwordless | Magic links and OTP (email/SMS) |
| ThirdParty | Social login via OAuth 2.0/OIDC (Google, GitHub, Apple, etc.) |
| MultiFactorAuth | TOTP, WebAuthn (passkeys), SMS/Email OTP |
| UserRoles | Role-based access control (RBAC) |
| Account Linking | Merge social identities with email/password accounts |
| SAML SSO | Enterprise SAML (Enterprise Edition) |

## Session Flow

1. User signs up/signs in via Frontend SDK → request goes to Backend SDK API endpoint.
2. Backend SDK calls SuperTokens Core, which hashes password, creates user record, generates AccessToken + RefreshToken + Anti-CSRF token.
3. Tokens returned to Frontend SDK via Backend SDK. Frontend stores tokens appropriately (httpOnly cookies for browser, Authorization header for mobile/CLI).
4. On subsequent API calls, Backend SDK verifies the AccessToken locally using cached signing keys — no Core contact needed.
5. When AccessToken expires, Frontend SDK calls a refresh endpoint on Backend SDK, which exchanges the RefreshToken with Core for a new token pair (rotation + theft detection).
6. On logout, Backend SDK calls Core to revoke the session (invalidate all tokens in the family).

## Deployment Modes

- **Self-hosted (free, unlimited users):** Core runs as a Docker container or Java JAR behind a load balancer, backed by your PostgreSQL instance. Scales horizontally — Core is stateless, PostgreSQL handles shared state.
- **Managed cloud:** SuperTokens Inc. hosts the Core. Pricing starts at $0.02/MAU with a free tier up to 5,000 MAUs. Same SDKs, only the connectionURI changes.
- **Enterprise Edition:** Adds SAML SSO, advanced multi-tenancy, account linking, and feature flags. Self-hosted with paid add-ons (MFA $0.02/MAU, Account Linking $0.01/MAU).

SDKs work identically in all modes — only the Core connection URI differs.

## Session Verification Performance

The Backend SDK verifies access tokens locally without contacting Core. It maintains a cache of signing keys (JSON Web Key Set) that it fetches from Core on startup and refreshes periodically. This means session verification scales independently of Core capacity — the Backend SDK can handle millions of verifications per second on modest hardware.

## Database

PostgreSQL v13+ is the sole supported database. SuperTokens uses JSONB columns for flexible user metadata and maintains specific tables for users, sessions, email verification, roles, and third-party identities. Database migrations run automatically on Core startup.

## Relevant notes

- [[budget-digital-homelab-for-sustainable-living]]
- [[digital-homelab-hardening-core-security-practices]]
- [[securing-paseo-daemon-with-tailscale]]
- [[self-hosted-software-stack-for-off-grid-resilience]]