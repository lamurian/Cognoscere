---
author: Lam
date: 2024-11-29T20:32:32+01:00
title: Measuring semantic similarity of contexts with SBERT in R
source:
- https://chatgpt.com/share/674a172a-5f88-8006-b361-88055a2b8ca3
tags:
- LLM
- NLP
- embedding
- R
---

Note: For some reason, this code does not run and returns the following error:

```
Error in python_config_impl(python) :
  Error 1 occurred running /usr/bin/python3:
In addition: Warning message:
In system2(command = python, args = shQuote(script), stdout = TRUE,  :
  running command ''/usr/bin/python3' '/home/lam/R/x86_64-unknown-linux-gnu-library/4.3/reticulate/config/config.py' 2>/dev/null' had status 1
```

There seems to be an issue with the `config.py` file, because it tries to import `imp` package.

---

# Step 1: Install Required Libraries

Install the necessary packages. Run the following commands in your R console:

```R
install.packages("text")
install.packages("torch")
install.packages("ggplot2")  # Optional for visualization
```

---

# Step 2: Load Pre-Trained SBERT Model
The `text` package provides access to SBERT embeddings through pre-trained models.

```R
library(text)
library(torch)

```

---

# Step 3: Define Your Phrases
List the phrases for which you want to compute similarity.

```R
phrases <- c("Coping Mechanisms", "Instant gratification", "coping strategy")
```

---

# Step 4: Generate Phrase Embeddings
Use the SBERT model to encode phrases into embeddings.

```R
model <- text::textEmbedPretrained(phrases, model = "sentence-transformers/all-MiniLM-L6-v2")
```

---

# Step 5: Compute Similarity Scores
Use cosine similarity to measure the similarity between embeddings.

```R
similarity_matrix <- textSimilarity(embeddings, embeddings)
print(similarity_matrix)
```

---

# Expected Output

```
              Coping Mechanisms Instant gratification coping strategy
Coping Mechanisms         1.000                  0.382           0.764
Instant gratification     0.382                  1.000           0.429
coping strategy           0.764                  0.429           1.000
```

# Relevant notes

- [measuring-phrase-and-word-similarity](Resources/measuring-phrase-and-word-similarity.md) 
- [measuring-semantic-similarity-of-contexts](Resources/measuring-semantic-similarity-of-contexts.md) 
- [measuring-semantic-similarity-of-contexts-with-SBERT-in-python](Resources/measuring-semantic-similarity-of-contexts-with-SBERT-in-python.md) 
