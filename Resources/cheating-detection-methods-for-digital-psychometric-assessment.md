---
title: Cheating Detection Methods for Digital Psychometric Assessment
description: Statistical methods and verification test designs for detecting cheating in unproctored psychometric testing, including IRT-based approaches
author: pi
editor: lam
date: 2026-07-26T10:36:32.647Z
tags:
  - psychometrics
  - assessment
  - statistics
  - testing
  - AI
---
## Summary

Several statistical methods have been developed to detect cheating in unproctored Internet-based psychometric tests without requiring continuous surveillance. Sanz et al. (2020) compared five statistics for detecting cheating in Computerized Adaptive Tests (CATs) using a verification test (VT) design: Guo and Drasgow's Z-test, the Adaptive Measure of Change (AMC), Likelihood Ratio Test (LRT), Score Test, and Modified Signed Likelihood Ratio Test (MSLRT). Through simulation of honest and cheating candidates, MSLRT showed the highest statistical power with appropriate Type I error rates, making it the recommended approach [@sanz2020].

The verification test paradigm works by administering a follow-up test after the main unproctored assessment. Honest candidates show consistent performance across both administrations, while cheaters (who inflated their scores on the main test) drop to their true ability level on the verified test. This two-step testing approach is widely used in personnel selection [@sanz2020; @scherrer2025].

In addition to VT-based detection, other approaches include: honour codes and integrity reminders (Zhao et al., 2024 found these significantly reduced cheating in both proctored and unproctored conditions), response time analysis (cheaters often show atypical speed patterns), and digital trace data analysis (keystroke dynamics, mouse movements) [@scherrer2025].

Scherrer et al. (2025) used direct video observation as the gold standard for detecting cheating, identifying 4% of participants as cheaters. This approach is impractical at scale but provides validation data for statistical detection methods. The authors noted that cheating was primarily concentrated in memory tasks, suggesting that detection methods should be tailored to the cheatability profile of specific subtests rather than applied uniformly.

## Key Points

- MSLRT is the most powerful statistical test for detecting cheating in CAT-based assessments
- Verification test design (two-step testing) is the most common detection framework
- Integrity reminders reduce cheating in both proctored and unproctored settings
- Detection methods should target high-cheatability subtests (memory, knowledge)

## Sources

- @sanz2020 - Detecting Cheating Methods on Unproctored Internet Tests
- @scherrer2025 - Effects of Proctoring on Online Intelligence Measurement

## Relevant notes

- [Mechanisms of Cheating in Remote Digital Psychometric Testing](Resources/mechanisms-of-cheating-in-remote-digital-psychometric-testing.md)
- [Evidence That Proctoring Improves Test Validity in Digital Psychometric Assessment](Resources/evidence-that-proctoring-improves-test-validity-in-digital-psychometric-assessment.md)
- [Bias and Discrimination in AI-Driven Proctoring Systems](Resources/bias-and-discrimination-in-ai-driven-proctoring-systems.md)
- [LLM Vulnerability and the End of Unproctored Psychometric Testing](Resources/llm-vulnerability-and-the-end-of-unproctored-psychometric-testing.md)
- [Validity Threats from Proctoring in Digital Self-Administered Psychometric Testing](Resources/validity-threats-from-proctoring-in-digital-self-administered-psychometric-testing.md)