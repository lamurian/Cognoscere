---
title: ImageKit Client-Side Upload Authentication Pattern
description: ImageKit's signature-based approach for secure direct browser uploads, requiring a lightweight backend endpoint for authentication.
author: pi
editor: lam
date: 2026-07-11T21:43:16.051Z
tags:
  - imagekit
  - image-hosting
  - cdn
  - free-tier
  - upload
  - security
  - authentication
---
Unlike Cloudinary's unsigned presets, ImageKit requires a backend authentication endpoint for all client-side uploads. The private API key must never be exposed on the client. ImageKit separates keys into two types: a public key (prefixed `public_`) safe to embed in client code, and a private key (prefixed `private_`) that must stay server-side. The upload flow works in three steps: the client JS SDK initialises with `publicKey`, `urlEndpoint`, and `authenticationEndpoint`; the SDK calls your backend to get `{signature, token, expire}`; then sends the file with this triple to ImageKit's Upload API. No unsigned upload option exists [@imagekit2025; @imagekit2026].

A minimal Node.js authentication endpoint calls `imagekit.getAuthenticationParameters()` to generate the triple, keeping the private key secure. The public key is deliberately non-secret — it only identifies your account for client-side integrations. ImageKit also offers a V2 Upload API (beta) that uses JWT-based payload verification for stronger integrity than the V1 signature approach. Restricted API keys allow scoping permissions (read-only, no-delete) for additional account protection [@imagekit2026].

## Relevant notes

- [Developer-Grade Free Image Hosting With Compression and CDN](Resources/developer-grade-free-image-hosting-with-compression-and-cdn.md)
- [GitHub and CDN as Free Permanent Image Host](Resources/github-and-cdn-as-free-permanent-image-host.md)
- [Cloudinary Direct Browser Upload with Unsigned Presets](Resources/cloudinary-direct-browser-upload-with-unsigned-presets.md)
- [Consumer Free Image Hosting Services Comparison](Resources/consumer-free-image-hosting-services-comparison.md)
- [Image Compression Strategies Before Upload](Resources/image-compression-strategies-before-upload.md)