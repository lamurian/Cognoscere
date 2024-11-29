---
author: Lam
date: 2024-11-29T23:44:26+01:00
title: Clearing up large cache after using huggingface models
source:
- https://chatgpt.com/share/674a43f7-3b74-8006-8688-6ce9e196f846
tags:
- tech
- python
---

Using HuggingFace models can require a lot of cache. It's a good idea to clear up the directory every now and then. The cache is usually stored within `~/.cache/huggingface`. Issue the following command to clear up some space:

```
rm -r ~/.cache/huggingface
```

# Relevant notes

- [measuring-semantic-similarity-of-contexts-with-SBERT-in-python](Resources/measuring-semantic-similarity-of-contexts-with-SBERT-in-python.md) 
- [clearing-up-large-cache-after-pip-install](Resources/clearing-up-large-cache-after-pip-install.md) 
