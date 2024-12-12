---
author: Lam
date: 2024-12-12T02:09:44+01:00
title: Limitation on the top-up sync strategy to speed up rclone sync
source:
- https://forum.rclone.org/t/how-to-sync-quickly/23622/12
tags:
- tech
- backup
---

When following the [top-up sync strategy](Resources/top-up-sync-strategy-to-speed-up-rclone-sync.md), beware that it will not recognize changes in the directory structure. Let's say that you have `file.txt` kept in `A` directory. If you move it to `B` directory and the age exceeds the `--max-age` option in `rclone`, this change will not be synced to the remote storage.

