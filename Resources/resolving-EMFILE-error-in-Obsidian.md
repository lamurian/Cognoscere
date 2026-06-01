---
title: Resolving EMFILE error in Obsidian
author: Lam
date: 2024-11-25T17:18:53+01:00
tags:
  - note-taking
  - tech
source: https://forum.obsidian.md/t/obsidian-and-latte-dock-emfile-error/15306/9
---
Issue the following command as a superuser:

```bash
echo 1024 > /proc/sys/fs/inotify/max_user_instances
```