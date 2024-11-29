---
author: Lam
date: 2024-11-29T20:06:06+01:00
title: Measuring phrase and word similarity
source:
- https://chatgpt.com/share/674a172a-5f88-8006-b361-88055a2b8ca3
tags:
- LLM
- NLP
---

Measuring similarity among phrases and words is not a trivial problem. Some words have similar interpretation, yet distinctive description. See the following quote as an example:

> ...highly stressed online gamers may use online gaming (problematically) as a way to relieve their preexisting life stress, which might further magnify their stress experience.

This quote implies (problematic) gaming as a method to relieve stress, which later heightens the stress. The key concept of this quote is pertaining to coping strategy, which involves reward-seeking behavior, i.e. problematic gaming. As such, both "coping strategy" and "instant gratification" may *similarly* represent the contextualized behavior. However, without the context, "coping strategy" and "instant gratification" do not always belong in the same category.

There are several approaches to measure text similarity:
1. [Word-to-word similarity](Resources/measuring-semantic-similarity-of-words.md) 
2. [Phrase-to-phrase similarity](Resources/measuring-semantic-similarity-of-phrases.md) 
3. [Contextual similarity](Resources/measuring-semantic-similarity-of-contexts.md) 
