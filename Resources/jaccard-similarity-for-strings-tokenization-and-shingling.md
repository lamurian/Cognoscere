---
title: 'Jaccard Similarity for Strings: Tokenization and Shingling'
description: 'How to apply Jaccard similarity to strings: convert strings to sets of tokens (words, k-shingles, character n-grams), with padding conventions and worked examples.'
author: pi
editor: lam
date: 2026-08-14T23:02:28.298Z
tags:
  - string-matching
  - similarity-search
  - data-science
  - reference
---
## Summary

Jaccard similarity operates on sets, so to measure the similarity of two strings you first convert each string into a set of tokens, then compute |A ∩ B| / |A ∪ B| over the token sets [@kube2026; @phillips2013]. Token choice determines behavior: word tokens (bag of words), k-shingles (consecutive runs of k words), or character n-grams (overlapping substrings of length n, also called q-grams or k-mers) [@phillips2013; @blurock2025]. Set-based measures do not specify the tokenization — any of these work with the same Jaccard formula [@blurock2025].

The token methods pipeline has three steps: tokenize (define the token set), count (how many distinct tokens each string has), and measure (normalize the shared-token count to [0,1]) [@blurock2025].

## Character n-gram Tokenization

The straightforward bigram tokenization of WORD gives {WO, OR, RD}, leaving the edge letters W and D under-represented. Padding the string with a delimiter symbol fixes this edge effect: #WORD# digests into the bigrams #W, WO, OR, RD, D# — every input character now appears in exactly two bigrams [@kube2026]. The Data Science textbook example: tokenizebigrams("HELLO") = [#H, HE, EL, LL, LO, O#] and tokenizebigrams("HELP") = [#H, HE, EL, LP, P#]; the shared bigrams are #H, HE, EL, so J(HELLO, HELP) = 3/8 = 0.375 [@kube2026].

## Word and Shingle Tokenization

For documents, the k-shingle (k-gram) approach groups consecutive words: the set of all 1-shingles is exactly the bag-of-words model; k-shingles capture word order locally [@phillips2013]. With 2-shingles, D1 "I am Sam" = {[I am], [am Sam]} and D2 "Sam I am" = {[Sam I], [I am]} give JS(D1,D2) = 1/3 ≈ 0.333 [@phillips2013]. A set example: A = {0,1,2,5,6} and B = {0,2,3,5,7,9} have intersection {0,2,5} and union of size 8, giving J = 3/8 = 0.375 [@phillips2013].

Baeldung's worked example compares "brave new world", "hello world", and "hello new world" using both word tokens and character 2-grams. Word-level Jaccard: J(A,B) = 0.25, J(A,C) = 0.5, J(B,C) = 0.66 — all measures rank "brave new world" and "hello new world" as closest [@blurock2025]. Note the Jaccard formula given there is J = |A ∩ B| / (|A| + |B| + |A ∩ B|) — a typo; the correct denominator is |A| + |B| − |A ∩ B|, which equals |A ∪ B| [@blurock2025].

## Order Insensitivity and Modeling Choices

Token methods are order-insensitive: "Hello World" and "World Hello" receive the same score because token positions are ignored — this is the price paid for a fast, simple comparison [@blurock2025]. Shingle length k and token type matter: word-level k = 2–3 for short documents (emails), k = 3–4 for research articles; character shingles of length 5 already span ~14M possible combinations in English [@phillips2013]. Whitespace, capitalization, punctuation, and stop-word handling are all modeling decisions [@phillips2013].

## Real-World Example: Fuzzy Name Matching

Pairwise bigram Jaccard over ~4000 police officer names found Barresi,Anthony vs Baresi,Anthony at 0.9375, Gonzalez,Marcos vs Gonzalez,Marco at 0.8235, and Garcia,Roberto vs Garcia,Robert at 0.8125 — surfacing candidate misspellings and near-duplicates without any understanding of the names [@kube2026].

## Key Points

- Convert strings to token sets (words, k-shingles, character n-grams) before computing Jaccard
- Pad with delimiters (#WORD#) so edge characters appear in equal numbers of n-grams
- J(HELLO, HELP) = 3/8 = 0.375 over bigram sets; identical strings give 1, disjoint give 0
- Token methods ignore token order — reordered strings score identically
- Shingle size k is a key tuning parameter: 2–3 for emails, 3–4 for research articles
- Jaccard over character n-grams finds near-duplicate names (Barresi/Baresi at 0.94) without semantic understanding

## Sources

- [@kube2026] Kube — Introduction to Data Science I & II, Set-based (Jaccard) similarity
- [@phillips2013] Phillips — Jaccard Similarity and Shingling, CS 6955 Data Mining lecture notes, University of Utah
- [@blurock2025] Blurock — String Similarity Metrics: Token Methods, Baeldung

Related: [[Resources/jaccard-similarity-definition-and-properties.md]] — the core formula and properties; [[Resources/hungarian-algorithm-for-string-list-matching.md]] — Jaccard as a pairwise similarity measure in string-list assignment.

## Relevant notes

- [Jaccard Similarity: Definition and Properties](Resources/jaccard-similarity-definition-and-properties.md)
- [Hungarian Algorithm for String List Matching](Resources/hungarian-algorithm-for-string-list-matching.md)
- [Semantic Caching for Agent Workloads](Resources/semantic-caching-for-agent-workloads.md)
- [Developmental Milestones at 7 Months](Resources/developmental-milestones-at-7-months.md)
- [FAISS: Library for Efficient Similarity Search](Resources/faiss-library-for-efficient-similarity-search.md)