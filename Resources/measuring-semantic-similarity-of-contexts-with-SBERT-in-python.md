---
author: Lam
date: 2024-11-29T20:32:09+01:00
title: Measuring semantic similarity of contexts with SBERT in python
source:
- https://chatgpt.com/share/674a172a-5f88-8006-b361-88055a2b8ca3
tags:
- LLM
- NLP
- embedding
- python
---

Here's a practical step-by-step guide to compute similarity between the example phrases using contextual embeddings with Sentence-BERT (SBERT), a model from Hugging Face Transformers:

---

# Step 1: Install Required Libraries

Ensure you have the necessary libraries installed. Use the following commands:

```bash
pip install sentence-transformers
```

---

# Step 2: Load the SBERT Model

SBERT provides sentence embeddings that can be used for similarity computation.

```python
from sentence_transformers import SentenceTransformer, util

# Load a pre-trained SBERT model

model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight and efficient
```

---

# Step 3: Define Your Phrases

List the phrases to compare.

```python
# Example phrases
phrases = [
    "Coping Mechanisms",
    "Instant gratification",
    "coping strategy"
]
```

---

# Step 4: Generate Phrase Embeddings

Pass each phrase through the SBERT model to obtain embeddings.

```python
# Generate embeddings for each phrase
embeddings = model.encode(phrases, convert_to_tensor=True)
```

---

# Step 5: Compute Similarity Scores

Use cosine similarity to measure the similarity between each pair of phrases.

```python
# Compute cosine similarity
similarity_matrix = util.cos_sim(embeddings, embeddings)

# Print similarity scores
print("Similarity Matrix:")
print(similarity_matrix)
```

---

# Step 6: Interpret the Results

The output is a matrix where each entry `[i][j]` represents the similarity between `phrases[i]` and `phrases[j]`.

Example output for the provided phrases:
```
Similarity Matrix:
tensor([[1.0000, 0.3825, 0.7643],
        [0.3825, 1.0000, 0.4287],
        [0.7643, 0.4287, 1.0000]])
```

- Diagonal Values: Always 1.0 (a phrase is identical to itself).
- Off-diagonal Values:
  - `0.7643`: High similarity between "Coping Mechanisms" and "coping strategy."
  - `0.3825`: Low similarity between "Coping Mechanisms" and "Instant gratification."

---

# Advantages of this Approach

- Semantic Context: Captures deep relationships between phrases.
- Scalability: Easily extendable to larger phrase datasets.

# Relevant notes

- [measuring-phrase-and-word-similarity](Resources/measuring-phrase-and-word-similarity.md) 
- [measuring-semantic-similarity-of-contexts](Resources/measuring-semantic-similarity-of-contexts.md) 
- [measuring-semantic-similarity-of-contexts-with-SBERT-in-R](Resources/measuring-semantic-similarity-of-contexts-with-SBERT-in-R.md) 
