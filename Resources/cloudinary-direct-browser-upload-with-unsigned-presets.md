---
title: Cloudinary Direct Browser Upload with Unsigned Presets
description: How Cloudinary unsigned upload presets enable direct browser uploads without exposing API secrets, and security best practices.
author: pi
editor: lam
date: 2026-07-11T22:23:12.872Z
tags:
  - cloudinary
  - image-hosting
  - cdn
  - free-tier
  - upload
  - security
---

Cloudinary unsigned uploads are production-ready when the preset is hardened against abuse. The client POSTs directly to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` with the preset name as `upload_preset`. Only the cloud name and preset name are exposed — neither the API key nor API secret is needed. The preset centrally controls all upload behavior, and only a restricted set of parameters can be passed directly in the request. Unsigned uploads cannot overwrite existing assets [@cloudinary2026; @cloudinary2026a].

To prevent abuse in production, configure the unsigned preset with multiple layers of defense. Set `allowed_formats` to a strict list (jpg, png, webp) to block scripts and unexpected file types. Set `max_file_size` and `max_image_width`/`max_image_height` to reject oversized files. Enable `disallow_public_id` so clients cannot control the public ID, preventing naming collisions or content injection. Apply incoming transformations to normalize resolution, strip EXIF metadata, and convert to a standard format like f_webp. Enable moderation (manual, AI-based via Amazon Rekognition or Cloudinary AI Content Analysis) to review uploads before they become publicly accessible. Use `restricted_access` mode so uploaded assets return 404 until explicitly approved [@cloudinary2026a].

For delivery-side protection, use signed delivery URLs. Cloudinary supports the `s--SIGNATURE--` notation in the delivery URL path — this requires a cryptographic signature for each URL, making it impossible for someone to hotlink an image without a valid signed URL. The signature can include an expiration timestamp using the `--exp--` notation, limiting access to a time window [@cloudinary2026b]. This is particularly useful for environments where the same preset is shared across multiple users or cameras.

For multi-tenant or user-identity-sensitive apps, pair the unsigned preset with a lightweight validation endpoint. The client authenticates against your backend first, receives approval, and then proceeds with the unsigned upload. This keeps your server out of the upload data path while still controlling who can upload — similar to the authentication endpoint pattern used by ImageKit [@imagekit2025]. Monitor your Cloudinary usage dashboard for upload volume anomalies, and rotate the preset name if it is ever exposed or abused.

## Relevant notes

- [ImageKit Client-Side Upload Authentication Pattern](Resources/imagekit-client-side-upload-authentication-pattern.md)
- [Image Compression Strategies Before Upload](Resources/image-compression-strategies-before-upload.md)
- [Developer-Grade Free Image Hosting With Compression and CDN](Resources/developer-grade-free-image-hosting-with-compression-and-cdn.md)
- [GitHub and CDN as Free Permanent Image Host](Resources/github-and-cdn-as-free-permanent-image-host.md)
- [Consumer Free Image Hosting Services Comparison](Resources/consumer-free-image-hosting-services-comparison.md)