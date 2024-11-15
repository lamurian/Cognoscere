---
author: Lam
date: 2024-11-14T18:51:53+01:00
title: Vector in maths
source:
- https://web.stanford.edu/class/nbio228-01/handouts/Ch4_Linear_Algebra.pdf
- https://www.mathsisfun.com/algebra/vectors-dot-product.html
- https://www.mathsisfun.com/algebra/vectors-cross-product.html
tags:
- mathematics
- algebra
---

# Introduction

Vector is a point in a space ordinated by a list of scalars. Imagine that you have a two-dimensional space of $X$ and $Y$. In this space, there exist a point within $\langle x, y \rangle$ ordinate. The $\langle x, y \rangle$ ordinate is a vector in a two-dimensional space. Having an ordinate granted a vector with a *direction* in addition to a magnitude. The direction is relatively measured based on the starting point, which conveniently set to 0. For example, a vector of $\langle 3, 4 \rangle$ has a magnitude of 5 pointing to the upper-right quadrant. As another example, a vector of $\langle -3, -4 \rangle$ has a magnitude of 5 pointing to the lower-left quadrant. Suppose that we have a general vector of $\vec{v} = \langle a, b, ..., n \rangle$, then we can calculate the magnitude as $\|\vec{v}\| = \sqrt{a^2 + b^2 + ... + n^2}$.

# Mathematics operations

As vector is a list of scalars, it inherits the computational property of a scalar, which mean that we can perform mathematics operation to a vector. Addition and subtraction are straightforward, as we only need to perform the operation element-wise. However, multiplication is slightly different. Suppose that we have the following vectors:

- $\vec{x} = \langle 3, 4 \rangle$, which has a magnitude of $\|\vec{x}\| = 5$ and pointing to the upper-right quadrant
- $\vec{y} = \langle -3, 4 \rangle$, which has a magnitude of $\|\vec{y}\| = 5$ and pointing to the upper-left quadrant

## Addition and subtraction

The addition and subtraction of any vector with the same length is simply the addition and subtraction of its elements, for instance:

$$
\begin{align}
\vec{x} + \vec{y} &= \langle 3, 4 \rangle + \langle -3, 4 \rangle \\
 &= \langle (3 - 3), (4 + 4) \rangle \\
 &= \langle 0, 8 \rangle
\end{align}
$$

$$
\begin{align}
\vec{x} - \vec{y} &= \langle 3, 4 \rangle - \langle -3, 4 \rangle \\
 &= \langle (3 + 3), (4 - 4) \rangle \\
 &= \langle 6, 0 \rangle
\end{align}
$$

## Multiplication

Vector multiplication is a bit different compared to scalar multiplication. There are two approaches to perform vector multiplication, namely by finding the dot product or the cross product. The dot product is a scalar representing the magnitude of a vector projected into another vector.^[https://math.stackexchange.com/a/2093527] On the other hand, the cross product is a resulting vector perpendicular to both input vectors, which represents the rejecting forces of the input vectors.^[https://math.stackexchange.com/a/1506329] The intuition behind both approaches:

- Dot product: Measure similarity of the input vectors as a single number
- Cross product: Measure the amount of difference of the input vectors as an output vector

The dot product maximizes the results when both vectors are pointing at exactly the same direction, and therefore calculated as $\vec{x} \cdot \vec{y} = \|\vec{x}\| \times \|\vec{y}\| \times cos(\theta)$. Multiplying the magnitudes of both vectors with the cosine of $\theta$ ensures that it will maximize the results when $\theta = 0$, implying that both vectors are pointing towards the same direction. Alternatively, it can also be calculated as $\vec{x} \cdot \vec{y} = \vec{x}_x \times \vec{y}_x + \vec{x}_y \times \vec{y}_y$.^[https://www.mathsisfun.com/algebra/vectors-dot-product.html]

The cross product maximizes the results when both vectors are pointing at different directions. The result is a vector perpendicular to both input vectors. Imagine it this way: when to forces are crossing each other, the collateral impact will happen perpendicular to the direction of both forces. For example, we can use torque forces to illustrate the cross product.^[https://phys.libretexts.org/Bookshelves/University_Physics/Calculus-Based_Physics_(Schnick)/Volume_A%3A_Kinetics_Statics_and_Thermodynamics/21A%3A_Vectors_-_The_Cross_Product_and_Torque] We can calculate the cross product as $\vec{x} \times \vec{y} = \|\vec{x}\| \times \|\vec{y}\| \times sin(\theta) \times n$, where $\theta$ is the angle between both vectors and $n$ is the unit vector of the resulting perpendicular vector.

# Relevant notes

- [scalar-in-math](Areas/scalar-in-math.md) 
- [matrix-in-math](Areas/matrix-in-math.md) 
- [array-in-math](Areas/array-in-math.md) 

