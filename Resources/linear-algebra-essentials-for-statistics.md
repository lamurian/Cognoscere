---
title: Linear Algebra Essentials for Statistics
description: Vectors, matrices, eigenvalues, and matrix decompositions needed for regression and multivariate statistics
author: pi
editor: lam
date: 2026-06-01T21:04:48.594Z
tags:
  - roadmap
  - statistics
  - fundamental
---
# Linear Algebra Essentials for Statistics

## Overview

Linear algebra is the workhorse of modern statistics. It appears everywhere: from OLS regression (solving $X^TX\hat{\beta} = X^Ty$) to Bayesian linear regression (covariance structures) to PCA (eigendecomposition). This note covers the essential linear algebra you need, with R and Python code.

## 1. Vectors and Vector Operations

A vector is an ordered list of numbers. In statistics, vectors represent:
- An observation with multiple variables: $x_i = [x_{i1}, x_{i2}, ..., x_{ip}]$
- A column of data: $y = [y_1, y_2, ..., y_n]^T$

### Key operations
- Dot product: $a \cdot b = \sum_i a_i b_i$
- Norm (length): $||a|| = \sqrt{\sum_i a_i^2}$
- Orthogonality: Two vectors are orthogonal if $a \cdot b = 0$

## 2. Matrices

A matrix is a rectangular array of numbers. Size: $n \times p$ (n rows, p columns).

### Matrix Multiplication
$C = AB$ where $c_{ij} = \sum_k a_{ik} b_{kj}$

Crucial in statistics: The normal equations $X^T X \hat{\beta} = X^T y$ involve matrix multiplication.

R:
```r
X <- matrix(rnorm(20), nrow = 10, ncol = 2)
y <- rnorm(10)
beta_hat <- solve(t(X) %*% X) %*% t(X) %*% y
```

Python:
```python
import numpy as np
X = np.random.randn(10, 2)
y = np.random.randn(10)
beta_hat = np.linalg.inv(X.T @ X) @ X.T @ y
```

### Special Matrices
| Type | Property | Use in Statistics |
|------|----------|-------------------|
| Identity $I$ | $AI = IA = A$ | Base case for transformations |
| Diagonal | Non-zero only on diagonal | Variance-covariance with independent errors |
| Symmetric | $A = A^T$ | Covariance matrices, correlation matrices |
| Positive Definite | $x^T A x > 0$ for all $x \neq 0$ | Must hold for valid covariance matrices |
| Projection | $P = X(X^T X)^{-1}X^T$ | Projects onto column space of X (hat matrix in OLS) |

## 3. Matrix Decompositions

### Eigen decomposition
$A = Q \Lambda Q^{-1}$ where:
- $\Lambda$ = diagonal matrix of eigenvalues $\lambda_i$
- $Q$ = columns are eigenvectors

Used in: PCA (principal components are eigenvectors of the covariance matrix)

### Singular Value Decomposition (SVD)
$A = U \Sigma V^T$ where $U, V$ are orthogonal and $\Sigma$ is diagonal.

Used in: PCA, matrix factorisation, ridge regression, and solving ill-conditioned least squares.

### Cholesky Decomposition
$\Sigma = LL^T$ where $L$ is lower triangular.

Used in: Sampling from multivariate normal distributions (key for Bayesian computation).

R — Cholesky for MVN sampling:
```r
Sigma <- matrix(c(1, 0.5, 0.5, 2), 2, 2)
L <- chol(Sigma)  # upper triangular such that t(L) %*% L = Sigma
z <- rnorm(2)
sample <- t(L) %*% z + c(0, 0)  # multivariate normal sample
```

Python — Cholesky for MVN sampling:
```python
Sigma = np.array([[1, 0.5], [0.5, 2]])
L = np.linalg.cholesky(Sigma)  # lower triangular
z = np.random.randn(2)
sample = L @ z + np.array([0, 0])
```

## 4. Vectors, Covariance, and Correlation

The covariance matrix $\Sigma$ of a $p$-dimensional random vector is:

$$\Sigma_{ij} = \text{Cov}(X_i, X_j) = E[(X_i - \mu_i)(X_j - \mu_j)]$$

- $\Sigma$ is always symmetric and positive semi-definite
- Diagonal entries are variances: $\Sigma_{ii} = \text{Var}(X_i)$
- In Bayesian analysis, the prior covariance encodes beliefs about relationships between parameters
- In frequentist regression, $\text{Var}(\hat{\beta}) = \sigma^2 (X^T X)^{-1}$ involves the inverse of $X^T X$

## 5. What Level Is Needed?

| Topic | Linear algebra needed |
|-------|----------------------|
| Simple linear regression | Basic algebra, sum notation |
| Multiple regression | Vectors, matrix multiplication, matrix inverse |
| Bayesian linear regression | All of the above + Cholesky decomposition |
| PCA / Factor analysis | Eigen decomposition, SVD |
| Gaussian Processes | Kernels as inner products, Cholesky for stable computation |

## Resources

- "Linear Algebra" — MIT 18.06 by Gilbert Strang (free on YouTube)
- "Matrix Algebra from a Statistician's Perspective" by Harville
- "The Matrix Cookbook" (free PDF, reference for identities)

## References

- Strang, G. (2016). Introduction to Linear Algebra. 5th ed. Wellesley-Cambridge Press.
- Harville, D.A. (1997). Matrix Algebra from a Statistician's Perspective. Springer.

## Relevant notes

- [[fundamental-mathematics-for-statistics]]
- [[AGENTS]]
- [[descriptive-statistics-data-visualisation]]
- [[frequentist-vs-bayesian-philosophy]]