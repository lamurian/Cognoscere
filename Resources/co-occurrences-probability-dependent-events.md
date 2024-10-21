---
author: Lam
date: 2024-10-21T02:24:26+02:00
title: Co-occurrences probability dependent events
source: https://chatgpt.com/share/67159f01-b710-8006-bc1f-ce8093ec9297
tags:
- statistics
- probability
---

If events $ A $ and $ B $ are conditionally interrelated, meaning that the occurrence of one event affects the probability of the other, we need to use conditional probability to calculate the probability that both events $ A $ and $ B $ occur for the same object $ O $.

In this case, the probability of both $ A $ and $ B $ occurring is given by the formula for joint probability of dependent events:

$$
P(A \text{ and } B) = P(A) \times P(B \mid A)
$$
or equivalently,
$$
P(A \text{ and } B) = P(B) \times P(A \mid B)
$$

Here:
- $ P(A) $ is the probability of event $ A $,
- $ P(B) $ is the probability of event $ B $,
- $ P(B \mid A) $ is the conditional probability of event $ B $ given that $ A $ has occurred,
- $ P(A \mid B) $ is the conditional probability of event $ A $ given that $ B $ has occurred.

To compute this, we need additional information about how $ A $ and $ B $ influence each other, i.e., either $ P(B \mid A) $ or $ P(A \mid B) $. Without this, we can't specify the exact probability of both events happening together.

### Example: 
If $ P(B \mid A) $ (the probability of $ B $ occurring given that $ A $ has occurred) is 0.5, then:

$$
P(A \text{ and } B) = P(A) \times P(B \mid A) = 0.3 \times 0.5 = 0.15
$$

In this case, the probability of both $ A $ and $ B $ occurring would be 0.15 or 15%.

The key is knowing the conditional probability that relates the two events. If you have that information, you can compute the joint probability accordingly.
