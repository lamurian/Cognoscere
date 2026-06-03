---
title: Okapi BM25 and its Variants
author: pi
editor: lam
date: 2026-06-03T11:18:12.504Z
tags:
  - BM25
  - information retrieval
  - search
  - ranking
  - probabilistic model
  - Okapi
  - BM25F
  - BM25+
  - BM25L
---
## Overview

Okapi BM25 (Best Match 25) is a family of probabilistic ranking functions developed by Stephen Robertson, Karen Spärck Jones, and colleagues at City University, London, in the context of the Okapi information retrieval system. It was first presented at the TREC conference in 1994 and has since become one of the most widely used document scoring functions in information retrieval [@Robertson1994Okapi].

BM25 is rooted in the **Probabilistic Relevance Framework** (PRF), which estimates the probability that a document is relevant to a query based on term occurrences. Unlike simpler TF-IDF models, BM25 introduces **term-frequency saturation** and **document-length normalisation**, making it substantially more effective on real-world collections [@RobertsonZaragoza2009BM25].

---

## The BM25 Scoring Formula

Given a query Q containing terms q₁, q₂, ..., qₙ and a document D, the BM25 score is:

```
BM25(D, Q) = Σ  IDF(qᵢ) · ( tf(qᵢ, D) · (k₁ + 1) ) / ( tf(qᵢ, D) + k₁ · (1 - b + b · |D| / avgdl) )
```

Where:

| Symbol | Meaning |
|---|---|
| `tf(qᵢ, D)` | Term frequency of qᵢ in document D |
| `|D|` | Length of document D (in tokens) |
| `avgdl` | Average document length across the corpus |
| `N` | Total number of documents in the corpus |
| `df(qᵢ)` | Number of documents containing term qᵢ (document frequency) |

### Inverse Document Frequency (IDF)

```
IDF(qᵢ) = ln( (N - df(qᵢ) + 0.5) / (df(qᵢ) + 0.5) + 1 )
```

This is the Robertson-Spärck Jones IDF variant, which avoids negative values (unlike the raw log(N/df) formula) and provides a smooth saturation for very common terms [@SparckJones2000Probabilistic].

### Key Parameters

- **k₁** (default ≈ 1.2–2.0) — Controls **term-frequency saturation**. At k₁ = 0, only term presence matters (binary). As k₁ → ∞, raw TF dominates. Typical optimal values lie between 1.2 and 2.0 [@Trotman2014BM25].
- **b** (default ≈ 0.75) — Controls **document-length normalisation**. At b = 0, no length normalisation is applied (long documents are not penalised). At b = 1, full length normalisation is applied. Typical optimal values lie between 0.5 and 0.8 [@Trotman2014BM25].

### Term-Frequency Saturation

A key insight of BM25 is that term frequency should have **diminishing returns**: the 10th occurrence of a term is less informative than the 1st. The saturation function `tf / (tf + k₁)` ensures that TF contributions plateau, preventing a single query term from dominating the score [@Manning2008IR].

---

## Variants

### BM25F (Fielded BM25)

BM25F extends BM25 to handle **structured documents** with multiple fields (e.g., title, body, anchor text, headings). Instead of a single term frequency per document, BM25F computes a **weighted combination** of field-level term frequencies [@Robertson2004BM25F]:

```
tf̃(qᵢ, D) = Σ (w_f · tf_f(qᵢ, D))
```

Where `w_f` is the weight of field `f` (e.g., title might get weight 5, body weight 1), and `tf_f` is the term frequency within that field. The combined `tf̃` is then plugged into the standard BM25 formula. This allows the model to **boost terms appearing in important fields** like titles or headings [@Robertson2004BM25F].

BM25F was developed by Robertson, Zaragoza, and Taylor (2004) and is implemented in search engines like MG4J, Terrier, and Elasticsearch.

### BM25L (BM25 with Lower-bounding)

BM25L addresses a deficiency of standard BM25: it **over-penalises very long documents**. The length normalisation component `(1 - b + b · |D| / avgdl)` can grow unboundedly for long documents, driving scores to near zero even if many query terms appear [@LvZhai2011BM25plus].

BM25L introduces a **lower bound** on the TF normalisation by "shifting" the formula:

```
score = Σ IDF(qᵢ) · ( tf · (k₁ + 1) ) / ( tf + k₁ · (1 - b + b · |D| / avgdl) ) + δ
```

Where `δ` is a small positive constant (typically `δ = 0.5`) that ensures very long documents with many matching terms retain a non-trivial score. This was shown to improve retrieval on **long documents** such as legal cases and scientific articles [@LvZhai2011BM25L].

### BM25+ (BM25 with Positive Lower Bound)

BM25+, proposed by Lv and Zhai (2011), takes a similar approach to BM25L but applies the **lower bound directly to the TF normalisation component** rather than the final score [@LvZhai2011BM25plus]:

```
TF_norm = tf / ( tf + k₁ · (1 - b + b · |D| / avgdl) )
BM25+ = Σ IDF(qᵢ) · ( TF_norm + δ )
```

This guarantees a minimum contribution from each matching term, preventing the "long document penalty" from overwhelming the score. Experiments on TREC collections showed BM25+ consistently outperforms standard BM25, especially on datasets with high variance in document length [@LvZhai2011BM25plus].

### Other Notable Variants

| Variant | Key Idea |
|---|---|
| **BM25B** | Uses a Bernoulli model for TF instead of the 2-Poisson, simplifying computation |
| **BM25-adpt** | Automatically tunes k₁ per term based on collection statistics, removing the need for manual k₁ tuning [@LvZhai2011BM25adpt] |
| **BM25-T** | Adds a third parameter k₃ for query term frequency (useful when queries contain repeated terms, as in relevance feedback) |
| **Reciprocal Rank Fusion (RRF)** | While not a scoring variant, RRF combines BM25 scores from multiple fields/indices using reciprocal ranking |

---

## Comparison with TF-IDF

| Aspect | TF-IDF | BM25 |
|---|---|---|
| TF saturation | Linear (no saturation) | Sub-linear (diminishing returns via k₁) |
| Length normalisation | Often none or heuristic (e.g., cosine normalisation) | Principled via b parameter |
| IDF | log(N / df) | Robertson-Spärck Jones variant (smoother, no negative values) |
| Theoretical basis | Heuristic / vector-space | Probabilistic relevance framework |
| Default parameters | None | k₁ = 1.2, b = 0.75 |

BM25 consistently outperforms TF-IDF on standard IR benchmarks (TREC, CLEF, etc.) across diverse collections [@RobertsonZaragoza2009BM25].

---

## Implementation Considerations

### Parameter Tuning

Optimal k₁ and b values vary by collection:
- **Web collections** (short, heterogeneous): k₁ ≈ 1.2, b ≈ 0.75 (standard)
- **Scientific articles** (long, uniform): k₁ ≈ 0.9, b ≈ 0.4
- **Legal documents** (very long): k₁ ≈ 1.5–2.0, b ≈ 0.3–0.5

These can be optimised via grid search on a held-out validation set, or from click-through data without manual annotations [@Schuth2014Optimizing].

### Batch Inverted-Index Lookups

For efficiency, modern BM25 implementations (like the one in this PARA system) batch all query-term lookups into a single SQL `IN (...)` query against the inverted index, keeping the number of database round-trips constant regardless of query length.

### Libraries and Tools

- **Lucene / Elasticsearch** — BM25 is the default similarity model since Lucene 6.0 [@ElasticsearchBM25]
- **Terrier** — Full BM25F support with field weights
- **Lemur / Indri** — BM25 with pseudo-relevance feedback
- **Whoosh** (Python) — Pure-Python BM25 implementation
- **rank-bm25** (Python) — Lightweight BM25 implementations including BM25L and BM25+