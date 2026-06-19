---
title: Fundamental Mathematics for Statistics
description: Calculus, probability axioms, combinatorics, and set theory as prerequisites for statistical inference
author: pi
editor: lam
date: 2026-06-01T21:04:48.579Z
tags:
  - roadmap
  - statistics
  - fundamental
---
# Fundamental Mathematics for Statistics

## Overview

Statistics is built on three mathematical pillars: calculus (for optimisation and integration), probability theory (the language of uncertainty), and combinatorics/set theory (the foundation of counting and events). This note covers the essential math you need before diving into statistical inference, with code examples in R and Python to make concepts concrete.

## 1. Calculus Essentials

### Derivatives
Derivatives measure the rate of change of a function. They are crucial for Maximum Likelihood Estimation (MLE) — finding the parameter values that maximise the likelihood function.

Key rules:
- Power rule: $\frac{d}{dx} x^n = n x^{n-1}$
- Chain rule: $\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)$
- Log derivative: $\frac{d}{dx} \ln(x) = \frac{1}{x}$

R — numerical derivative:
```r
# Numerical derivative of log-likelihood
d <- function(f, x, h = 1e-7) (f(x + h) - f(x - h)) / (2 * h)
log_lik <- function(mu) sum(dnorm(x, mean = mu, sd = 1, log = TRUE))
d(log_lik, 0)  # derivative at mu=0
```

Python — numerical derivative:
```python
import numpy as np
def d(f, x, h=1e-7):
    return (f(x + h) - f(x - h)) / (2 * h)
def log_lik(mu, x):
    return np.sum(np.log(np.exp(-0.5 * (x - mu)**2) / np.sqrt(2 * np.pi)))
x = np.random.randn(100)
print(d(lambda mu: log_lik(mu, x), 0.0))
```

### Integrals
Integrals compute areas under curves. They are essential for:
- Computing probabilities from probability density functions (PDFs)
- Bayesian marginal likelihood (normalising constant): $p(x) = \int p(x|\theta) p(\theta) d\theta$
- Expected values: $E[X] = \int x \cdot f(x) dx$

## 2. Probability Axioms (Kolmogorov)

Probability theory rests on three axioms:

1. Non-negativity: $P(A) \geq 0$ for any event $A$
2. Normalisation: $P(\Omega) = 1$ (the sample space has total probability 1)
3. Additivity: For mutually exclusive events $A_1, A_2, ...$, $P(\cup_i A_i) = \sum_i P(A_i)$

All of probability — both frequentist and Bayesian — follows from these three axioms. The only difference is what probability means:
- Frequentist: Long-run relative frequency of an event
- Bayesian: Degree of belief, updated via evidence

### Conditional Probability & Bayes' Theorem

$$P(A|B) = \frac{P(A \cap B)}{P(B)} \quad \Rightarrow \quad P(B|A) = \frac{P(A|B) P(B)}{P(A)}$$

This single theorem underpins all Bayesian inference.

## 3. Combinatorics

Counting rules for permutations and combinations:
- Permutations (order matters): $P(n,k) = \frac{n!}{(n-k)!}$
- Combinations (order doesn't matter): ${n \choose k} = \frac{n!}{k!(n-k)!}$

Used extensively in probability calculations for discrete outcomes and in non-parametric bootstrap methods.

## 4. Set Theory
- Union ($\cup$), Intersection ($\cap$), Complement ($A^c$)
- Venn diagrams for visualising relationships between events
- De Morgan's laws: $(A \cup B)^c = A^c \cap B^c$

## Key Resources

- Khan Academy — Calculus and Probability courses (free)
- "Introduction to Probability" by Blitzstein & Hwang (Harvard Stat 110, free online)
- "Calculus for Statistics" — MIT OpenCourseWare 18.01

## References

- Blitzstein, J. & Hwang, J. (2019). Introduction to Probability. CRC Press.
- DeGroot, M. & Schervish, M. (2012). Probability and Statistics. 4th ed. Pearson.

## Relevant notes

- [Resources — Agent Guidelines](AGENTS.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Descriptive Statistics & Data Visualisation](descriptive-statistics-data-visualisation.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)