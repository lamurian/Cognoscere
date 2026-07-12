---
title: Cloudinary Signed Delivery URLs with Unsigned Uploads
description: 'How signed delivery URLs work with unsigned uploads in Cloudinary: type parameter, sign_url, and the private/authenticated tradeoffs.'
author: pi
editor: lam
date: 2026-07-11T22:39:01.982Z
tags:
  - cloudinary
  - image-hosting
  - cdn
  - free-tier
  - upload
  - security
  - authentication
  - delivery
---
Cloudinary supports three delivery types set at upload via the `type` parameter: `upload` (default, public), `private` (original requires signed URL, derived versions public), and `authenticated` (both original and derived require signed URL). For unsigned uploads, `type` cannot be passed directly in the client request — it is not in the restricted set of unsigned upload parameters. However, you can set `type: private` or `type: authenticated` directly in the unsigned upload preset, which centrally controls all upload behavior [@cloudinary2026; @cloudinary2026a; @cloudinary2026c].

Assets uploaded with `type: upload` (the default for unsigned presets) are publicly accessible via CDN. Their delivery URLs do not require a signature. To add signed URL protection to these assets, generate the delivery URL on your backend using `sign_url: true` — this adds the `/s--SIGNATURE--` component to the URL, requiring Cloudinary to validate the signature before serving the asset. The SDK's `private_download_url` method also generates time-limited signed URLs with an `expires_at` parameter (default: 1 hour), though this method is primarily designed for `private`/`authenticated` assets [@cloudinary2026c; @cloudinary2026b].

For the strongest access control with unsigned uploads, set `type: authenticated` in your unsigned upload preset. Every image uploaded through that preset then requires a signed delivery URL for access, and once a derived version is generated, even its URL requires a signature. The tradeoff: you need a lightweight backend endpoint to generate these signed URLs (the API secret is required). For a fully serverless architecture with no backend at all, stick with `type: upload` and rely on the preset-level safeguards (allowed_formats, max_file_size, moderation) rather than delivery URL signing — you cannot generate signed URLs without exposing the API secret on the client [@cloudinary2026c].

## Relevant notes

- [Cloudinary Direct Browser Upload with Unsigned Presets](Resources/cloudinary-direct-browser-upload-with-unsigned-presets.md)
- [ImageKit Client-Side Upload Authentication Pattern](Resources/imagekit-client-side-upload-authentication-pattern.md)
- [Developer-Grade Free Image Hosting With Compression and CDN](Resources/developer-grade-free-image-hosting-with-compression-and-cdn.md)
- [GitHub and CDN as Free Permanent Image Host](Resources/github-and-cdn-as-free-permanent-image-host.md)
- [Image Compression Strategies Before Upload](Resources/image-compression-strategies-before-upload.md)