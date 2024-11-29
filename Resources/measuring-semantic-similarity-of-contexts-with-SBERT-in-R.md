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

Here’s a step-by-step procedure to compute similarity and extract the upper triangle using R. We will use the `text` and `torch` libraries for working with sentence embeddings.

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

# Load the SBERT model
model <- textEmbedPretrained("sentence-transformers/all-MiniLM-L6-v2")  # SBERT model
```

---

# Step 3: Define Your Phrases
List the phrases for which you want to compute similarity.

```R
# Define phrases
phrases <- c("Coping Mechanisms", "Instant gratification", "coping strategy")
```

---

# Step 4: Generate Phrase Embeddings
Use the SBERT model to encode phrases into embeddings.

```R
# Generate embeddings
embeddings <- textEmbed(phrases, model = model)
```

---

# Step 5: Compute Similarity Scores
Use cosine similarity to measure the similarity between embeddings.

```R
# Compute similarity matrix
similarity_matrix <- textSimilarity(embeddings, embeddings)

# Print the similarity matrix
print(similarity_matrix)
```

---

# Step 6: Extract the Upper Triangle
To extract the upper triangle of the similarity matrix, use standard indexing.

```R
# Extract upper triangle without diagonal
n <- nrow(similarity_matrix)
upper_triangle_indices <- which(upper.tri(similarity_matrix, diag = FALSE), arr.ind = TRUE)

# Pair phrases with their similarity scores
results <- data.frame(
  Phrase1 = phrases[upper_triangle_indices[, 1]],
  Phrase2 = phrases[upper_triangle_indices[, 2]],
  Similarity = similarity_matrix[upper_triangle_indices]
)

# Display results
print(results)
```

---

# Step 7 (Optional): Visualize the Similarity Matrix
Use a heatmap to visualize the similarities.

```R
library(ggplot2)

# Convert matrix to data frame for ggplot
matrix_df <- as.data.frame(as.table(as.matrix(similarity_matrix)))
colnames(matrix_df) <- c("Phrase1", "Phrase2", "Similarity")

# Heatmap
ggplot(matrix_df, aes(Phrase1, Phrase2, fill = Similarity)) +
  geom_tile() +
  scale_fill_gradient(low = "white", high = "blue") +
  theme_minimal() +
  labs(title = "Phrase Similarity Matrix")
```

---

# Expected Output

## Similarity Matrix:
```
              Coping Mechanisms Instant gratification coping strategy
Coping Mechanisms         1.000                  0.382           0.764
Instant gratification     0.382                  1.000           0.429
coping strategy           0.764                  0.429           1.000
```

## Upper Triangle Results:
```
             Phrase1              Phrase2 Similarity
1 Coping Mechanisms Instant gratification     0.382
2 Coping Mechanisms      coping strategy     0.764
3 Instant gratification coping strategy     0.429
```

# Relevant notes

- [measuring-phrase-and-word-similarity](Resources/measuring-phrase-and-word-similarity.md) 
- [measuring-semantic-similarity-of-contexts](Resources/measuring-semantic-similarity-of-contexts.md) 
- [measuring-semantic-similarity-of-contexts-with-SBERT-in-python](Resources/measuring-semantic-similarity-of-contexts-with-SBERT-in-python.md) 
