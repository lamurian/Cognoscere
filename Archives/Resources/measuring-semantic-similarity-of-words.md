---
author: Lam
date: 2024-11-29T20:21:35+01:00
title: Measuring semantic similarity of words
tags:
- LLM
- NLP
- embedding
---

# Word Embeddings:

Using pre-trained embeddings like `Word2Vec`, `GloVe`, or `FastText`, you can compute similarity scores between words based on their vector representations. These embeddings capture semantic meanings from large corpora. For your phrases:
- Represent "Coping," "Mechanisms," etc., as vectors.
- Compute cosine similarity for each word pair.

Advantages:
- Captures subtle semantic relationships, such as "coping" and "strategy" being related.

Tools:
- Libraries like `gensim` (`Word2Vec`, `FastText`), `spaCy`, or Transformers for embeddings.

# Thesaurus-Based Similarity:

Use a lexical resource like `WordNet` to calculate path-based similarity:
- `Synsets` for words are compared using measures like Leacock-Chodorow or Wu-Palmer similarity.

Example:
- "Coping" and "Strategy" might have overlapping concepts via shared `hypernyms`.

Tools:
- `NLTK` provides direct access to `WordNet`.

# Relevant notes

- [measuring-phrase-and-word-similarity](Resources/measuring-phrase-and-word-similarity.md) 
