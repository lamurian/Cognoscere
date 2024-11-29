---
author: Lam
date: 2024-11-29T23:39:34+01:00
title: Clearing up large cache after pip install
source:
- https://chatgpt.com/share/674a43f7-3b74-8006-8688-6ce9e196f846
tags:
- tech
- python
---

When installing a package, `pip` usually keep the cache. This can get enormous, especially with large packages. For example, installing `sentence-transformers` will take up some spaces because it may include pre-trained models or dependencies like `torch`. To check the cache directory path:

```
pip cache dir
```

To clean up the space, issue the following command:

```
pip cache purge
```

# Relevant notes

- [measuring-semantic-similarity-of-contexts-with-SBERT-in-python](Resources/measuring-semantic-similarity-of-contexts-with-SBERT-in-python.md) 
- [clearing-up-large-cache-after-using-huggingface-models](Resources/clearing-up-large-cache-after-using-huggingface-models.md) 
