---
author: Lam
date: 2024-11-14T18:20:47+01:00
title: Complex numbers
source:
- https://www.math.uri.edu/~merino/spring06/mth562/ShortHistoryComplexNumbers2006.pdf
- https://www.math.toronto.edu/mathnet/answers/imaghard.html
- https://betterexplained.com/articles/intuitive-arithmetic-with-complex-numbers/
tags:
- mathematics
---

# Rationale on complex numbers

Complex numbers arose from the need to solve cubic equations, which has been explored by Orlando Merino.^[https://www.math.uri.edu/~merino/spring06/mth562/ShortHistoryComplexNumbers2006.pdf] I choose a simpler approach, that is based on its usability. What is the use of a complex number? Summarizing the [note on real numbers](Areas/real-numbers.md), I noticed four uses of numbers:

1. To count (natural numbers, $\mathbb{N}$)
2. To relatively measure (integers, $\mathbb{Z}$)
3. To find a ratio (rational numbers, $\mathbb{Q}$)
4. To denote a continuous quantity (real numbers, $\mathbb{R}$)

None of these functions describe how we can define the result of a square root of negative numbers, e.g. $\sqrt{-1}$. That is where the complex number comes into play. In the classic solution of the cubic problem, there was a case of irreducibility, *viz.* failure to reduce the cubic form into a simpler form due to the presence of square root of negative numbers. Introducing the complex number here partly help in solving such issues!

# Negative numbers as the analogy of complex numbers

The proof behind complex numbers can be daunting and exhausting, so as a beginner it's important to focus on the interpretation. Think of complex numbers in analogous with negative numbers.^[https://betterexplained.com/articles/intuitive-arithmetic-with-complex-numbers/] Negative numbers are the inverse of positive numbers. Imagine that negative and positive numbers belong to one dimension, such as $-\infty, ..., -3, -2, -1, 0, 1, 2, 3, ..., \infty$. We can see that negative numbers are the mirror of its positive counterpart, with 0 as the mid point.

Complex numbers behave similarly, but not in one dimension. Complex numbers have two dimensions: real dimension + imaginary dimension, which usually being annotated as $a + bi$. As negative numbers are akin to the mirror of positive numbers, complex numbers are akin to the *rotation* of real numbers. Imagine that the real and imaginary dimensions are perpendicular to each other, where the real dimension occupies the $X$ axis while the imaginary dimension occupies the $Y$ axis. Having a $3 + 2i$ means that we have 3 units on the real dimension ($X$) rotated by 2 units on the imaginary dimension ($Y$).

# Complex number operations

Remember that the imaginary dimension is the square root of negative numbers, i.e. $i = \sqrt{-1}$. Since we can imagine that a complex number of $\mathbb{C} = (a + bi)$ as the presence of $a$ units on the real dimension rotated by $b$ unit on the imaginary dimension, the following operations are more intuitive to imagine:

| Operation | Intuition | Input | Output |
| :-------- | :-------- | :---: | :----: |
| Magnitude | Distance from zero | $(a + bi)$ | $\sqrt{a^2 + b^2}$ |
| Addition & subtraction | Add the dimensions separately | $(a + bi) - (c + di)$ | $(\{a - c\} + \{b + d\}i)$ |

Addition and subtraction are the basic operations to understand, which will aid well in understanding complex multiplication and division. Look at the following example of complex multiplication:

$$
\begin{align}
(3 + 2i) \times (2 + 4i) &= (3 \times 2) + (3 \times 4i) + (2i \times 2) + (2i \times 4i) \\
 &= 6 + 12i + 4i + 8i^2 \\
 &= 6 + 16i + (8 \times \left\{\sqrt{-1}\right\}^2) \\
 &= 6 + 16i + (8 \times -1) \\
 &= 6 + 16i - 8 \\
 &= -2 + 16i
\end{align}
$$

Similarly, we can also solve the following example of complex division:

$$
\begin{align}
\frac{3 + 4i}{1 + i} &= \frac{3 + 4i}{1 + i} \times \frac{1 - i}{1 - i} \\
 &= \frac{(3 + 4i) \times (1 - i)}{(1 + i) \times (1 - i)} \\
 &= \frac{(3 \times 1) + (3 \times \{-i\}) + (4i \times 1) + (4i \times \{-i\})}{(1 \times 1) + (1 \times \{-i\}) + (i \times 1) + (i \times \{-i\})} \\
 &= \frac{3 - 3i + 4i - 4i^2}{1 + -i + i - i^2} \\
 &= \frac{3 + i - (4 \times \left\{\sqrt{-1}\right\}^2)}{1 - \left\{\sqrt{-1}\right\}^2} \\
 &= \frac{3 + i - (-4)}{1 - (-1)} \\
 &= \frac{7 + i}{1 - (-1)} \\
 &= \frac{7 + i}{2}
\end{align}
$$

# Relevant notes

[real-numbers](Areas/real-numbers.md) 
