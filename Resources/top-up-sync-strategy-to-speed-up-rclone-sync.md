---
author: Lam
date: 2024-12-12T01:58:56+01:00
title: Top-up sync strategy to speed up rclone sync
source:
- https://forum.rclone.org/t/strageties-for-speeding-up-rclone-sync-times/20588/10
tags:
- tech
- backup
---

- When there are too many files to check, `rclone` will spend a lot of tim
- Even though the files being sent is very small, `rclone` will keep on checking all *other* files
- The solution would be to limit the sync and check
  ```
  rclone copy --max-age 1h /path remote:
  ```
- This command essentially limit `rclone` to only sync files from the past 1 hour
- Supported unit of duration: `ms|s|m|h|d|w|M|y`
