---
author: Lam
date: 2024-11-29T20:21:47+01:00
title: Measuring semantic similarity of phrases
tags:
- LLM
- NLP
- embedding
---

# Sentence Embeddings:

Models like SBERT (Sentence-BERT) provide embeddings for entire sentences or phrases. Compute the cosine similarity of phrase embeddings:
- "Coping Mechanisms" vs. "Coping Strategy."

Advantages:
- Contextual and accounts for the phrase structure.
- Good for short texts like your examples.

Tools:
- Hugging Face Transformers (e.g., SBERT).
- Pre-trained models like `all-MiniLM-L6-v2` for efficiency.

# Jaccard Similarity:

A simpler method:
1. Tokenize phrases into words or n-grams.
2. Compute the overlap ratio:
   $$
   \text{Jaccard Similarity} = \frac{\text{Intersection of Tokens}}{\text{Union of Tokens}}
   $$

Example:
- "Coping Mechanisms" and "Coping Strategy" share "Coping" → Similarity > 0.

Advantages:
- Easy to implement.
- No need for pre-trained models.

Tools:
- Tokenizers in Python: `nltk`, `spaCy`.

# C. Edit Distance (Levenshtein Distance):

Measure the number of operations (insertions, deletions, substitutions) needed to transform one phrase into another. A normalized version gives similarity:

$$
\text{Normalized Distance} = 1 - \frac{\text{Edit Distance}}{\text{Max Length of Phrases}}
$$

Example:
- High similarity between "Coping Mechanisms" and "Coping Strategy" due to small word differences.

Tools:
- Libraries: `textdistance`, `fuzzywuzzy`.

# Relevant notes

- [measuring-phrase-and-word-similarity](Resources/measuring-phrase-and-word-similarity.md) 
